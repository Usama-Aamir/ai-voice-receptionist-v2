import { createAdminClient } from "@/lib/supabase/admin";
import { sendAppointmentConfirmation } from "@/lib/email";

type AdminClient = ReturnType<typeof createAdminClient>;

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatDayName(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export type Service = {
  id: string;
  name: string;
  duration_minutes: number;
};

function normalizeServiceName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[-\s]+/g, " ")
    .trim();
}

export async function findService(
  admin: AdminClient,
  businessId: string,
  serviceName: string
): Promise<{ matched: Service } | { available: string[] }> {
  const { data: services } = await admin
    .from("services")
    .select("id, name, duration_minutes")
    .eq("business_id", businessId)
    .eq("is_active", true);

  const normalizedInput = normalizeServiceName(serviceName);

  // Exact normalized match
  for (const service of services ?? []) {
    if (normalizeServiceName(service.name) === normalizedInput) {
      return { matched: service as Service };
    }
  }

  // Partial / fuzzy match
  for (const service of services ?? []) {
    const normalizedService = normalizeServiceName(service.name);
    if (
      normalizedService.includes(normalizedInput) ||
      normalizedInput.includes(normalizedService)
    ) {
      return { matched: service as Service };
    }
  }

  return { available: (services ?? []).map((service) => service.name) };
}

export type AvailabilityResult =
  | { error: string; available_services?: string[] }
  | { closed: true; message: string }
  | {
      date: string;
      day_of_week: string;
      service: string;
      duration_minutes: number;
      slots: string[];
    };

export async function checkAvailability(
  admin: AdminClient,
  businessId: string,
  args: { date: string; service_name: string }
): Promise<AvailabilityResult> {
  const { date, service_name } = args;

  const serviceMatch = await findService(admin, businessId, service_name);

  if ("available" in serviceMatch) {
    return {
      error: `Service "${service_name}" was not found.`,
      available_services: serviceMatch.available,
    };
  }

  const service = serviceMatch.matched;

  const { data: closure } = await admin
    .from("business_closures")
    .select("reason")
    .eq("business_id", businessId)
    .eq("closure_date", date)
    .single();

  if (closure) {
    return {
      closed: true,
      message: closure.reason
        ? `The business is closed on this date (${closure.reason}).`
        : "The business is closed on this date.",
    };
  }

  const dayOfWeek = new Date(date).getUTCDay();

  const { data: hours } = await admin
    .from("business_hours")
    .select("open_time, close_time, is_closed")
    .eq("business_id", businessId)
    .eq("day_of_week", dayOfWeek)
    .single();

  if (!hours || hours.is_closed || !hours.open_time || !hours.close_time) {
    return {
      closed: true,
      message: "The business is closed on this date.",
    };
  }

  const openMinutes = timeToMinutes(hours.open_time);
  const closeMinutes = timeToMinutes(hours.close_time);
  const duration = service.duration_minutes;

  const { data: appointments } = await admin
    .from("appointments")
    .select("appointment_time, duration_minutes")
    .eq("business_id", businessId)
    .eq("appointment_date", date)
    .neq("status", "cancelled");

  const bookedRanges = (appointments ?? []).map((appointment) => ({
    start: timeToMinutes(appointment.appointment_time),
    end:
      timeToMinutes(appointment.appointment_time) +
      (appointment.duration_minutes ?? duration),
  }));

  const slots: string[] = [];
  for (
    let start = openMinutes;
    start + duration <= closeMinutes;
    start += duration
  ) {
    const end = start + duration;
    const overlaps = bookedRanges.some(
      (range) => start < range.end && end > range.start
    );
    if (!overlaps) {
      slots.push(minutesToTime(start));
    }
    if (slots.length >= 3) break;
  }

  return {
    date,
    day_of_week: formatDayName(new Date(date)),
    service: service.name,
    duration_minutes: service.duration_minutes,
    slots,
  };
}

export type BookAppointmentArgs = {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_name: string;
  date: string;
  time: string;
};

export type BookAppointmentResult =
  | { error: string; available_services?: string[] }
  | {
      success: true;
      customer_name: string;
      service_name: string;
      date: string;
      time: string;
      duration_minutes: number;
    };

export async function bookAppointment(
  admin: AdminClient,
  businessId: string,
  args: BookAppointmentArgs
): Promise<BookAppointmentResult> {
  const {
    customer_name,
    customer_phone,
    customer_email,
    service_name,
    date,
    time,
  } = args;

  const serviceMatch = await findService(admin, businessId, service_name);

  if ("available" in serviceMatch) {
    return {
      error: `Service "${service_name}" was not found.`,
      available_services: serviceMatch.available,
    };
  }

  const service = serviceMatch.matched;

  let customerId: string | null = null;
  let customerEmail: string | null = null;

  const { data: existingCustomer } = await admin
    .from("customers")
    .select("id, email")
    .eq("business_id", businessId)
    .eq("phone", customer_phone)
    .single();

  if (existingCustomer) {
    customerId = existingCustomer.id;
    customerEmail = existingCustomer.email ?? null;

    if (customer_email && !customerEmail) {
      await admin
        .from("customers")
        .update({ email: customer_email })
        .eq("id", customerId);
      customerEmail = customer_email;
    }
  } else {
    const { data: newCustomer, error: customerError } = await admin
      .from("customers")
      .insert({
        business_id: businessId,
        name: customer_name,
        phone: customer_phone,
        email: customer_email ?? null,
        status: "new",
      })
      .select("id")
      .single();

    if (customerError || !newCustomer) {
      return { error: "Failed to create customer record." };
    }

    customerId = newCustomer.id;
    customerEmail = customer_email ?? null;
  }

  const { data: business } = await admin
    .from("businesses")
    .select("name")
    .eq("id", businessId)
    .single();

  const { error: appointmentError } = await admin.from("appointments").insert({
    business_id: businessId,
    customer_id: customerId,
    service_name: service.name,
    appointment_date: date,
    appointment_time: time,
    duration_minutes: service.duration_minutes,
    status: "pending",
  });

  if (appointmentError) {
    return { error: "Failed to create appointment." };
  }

  if (customerEmail) {
    sendAppointmentConfirmation({
      to: customerEmail,
      businessName: business?.name ?? "the business",
      customerName: customer_name,
      serviceName: service.name,
      date,
      time,
      durationMinutes: service.duration_minutes,
    }).catch((error) => {
      console.error("Confirmation email failed:", error);
    });
  }

  return {
    success: true,
    customer_name,
    service_name: service.name,
    date,
    time,
    duration_minutes: service.duration_minutes,
  };
}
