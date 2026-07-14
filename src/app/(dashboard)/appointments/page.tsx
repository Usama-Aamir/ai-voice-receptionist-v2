import { AppointmentList } from "@/components/appointments/appointment-list";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, customers(name)")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  const { data: customers } = await supabase
    .from("customers")
    .select("id, name")
    .order("name", { ascending: true });

  const formattedAppointments = (appointments ?? []).map((appointment) => ({
    id: appointment.id,
    customer_id: appointment.customer_id,
    customer_name: appointment.customers?.name ?? null,
    service_name: appointment.service_name,
    appointment_date: appointment.appointment_date,
    appointment_time: appointment.appointment_time,
    duration_minutes: appointment.duration_minutes,
    status: appointment.status,
    notes: appointment.notes,
  }));

  return (
    <AppointmentList
      initialAppointments={formattedAppointments}
      customers={customers ?? []}
    />
  );
}
