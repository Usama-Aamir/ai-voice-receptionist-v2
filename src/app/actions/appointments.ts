"use server";

import { createClient } from "@/lib/supabase/server";
import { sendAppointmentConfirmation } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getCurrentBusinessId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: businessIds } = await supabase.rpc("user_business_ids");
  const businessId = (businessIds ?? [])[0];

  if (!businessId) {
    redirect("/onboarding");
  }

  return businessId;
}

export async function createAppointment(formData: FormData) {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const customerId = (formData.get("customer_id") as string) || null;
  const serviceName = (formData.get("service_name") as string) || null;
  const appointmentDate = formData.get("appointment_date") as string;
  const appointmentTime = formData.get("appointment_time") as string;
  const durationMinutes =
    parseInt(formData.get("duration_minutes") as string, 10) || 30;
  const notes = (formData.get("notes") as string) || null;

  const { error } = await supabase.from("appointments").insert({
    business_id: businessId,
    customer_id: customerId,
    service_name: serviceName,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    duration_minutes: durationMinutes,
    notes,
  });

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/appointments", "page");
}

export async function updateAppointment(formData: FormData) {
  await getCurrentBusinessId();
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const customerId = (formData.get("customer_id") as string) || null;
  const serviceName = (formData.get("service_name") as string) || null;
  const appointmentDate = formData.get("appointment_date") as string;
  const appointmentTime = formData.get("appointment_time") as string;
  const durationMinutes =
    parseInt(formData.get("duration_minutes") as string, 10) || 30;
  const status = formData.get("status") as string;
  const notes = (formData.get("notes") as string) || null;

  const { error } = await supabase
    .from("appointments")
    .update({
      customer_id: customerId,
      service_name: serviceName,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      duration_minutes: durationMinutes,
      status,
      notes,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/appointments", "page");
}

export async function deleteAppointment(formData: FormData) {
  await getCurrentBusinessId();
  const supabase = await createClient();

  const id = formData.get("id") as string;

  const { error } = await supabase.from("appointments").delete().eq("id", id);

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/appointments", "page");
}

export async function sendAppointmentConfirmationEmail(formData: FormData) {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const id = formData.get("id") as string;

  const { data: appointment } = await supabase
    .from("appointments")
    .select(
      "appointment_date, appointment_time, duration_minutes, service_name, customer_id"
    )
    .eq("id", id)
    .eq("business_id", businessId)
    .single();

  if (!appointment || !appointment.customer_id) {
    console.error("Cannot send confirmation: missing appointment or customer");
    return { sent: false };
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("name, email")
    .eq("id", appointment.customer_id)
    .eq("business_id", businessId)
    .single();

  if (!customer?.email) {
    console.error("Cannot send confirmation: missing customer email");
    return { sent: false };
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("id", businessId)
    .single();

  const result = await sendAppointmentConfirmation({
    to: customer.email,
    businessName: business?.name ?? "the business",
    customerName: customer.name ?? "Customer",
    serviceName: appointment.service_name ?? "Appointment",
    date: appointment.appointment_date,
    time: appointment.appointment_time,
    durationMinutes: appointment.duration_minutes,
  });

  return result;
}
