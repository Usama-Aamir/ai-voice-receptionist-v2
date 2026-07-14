"use client";

import {
  createAppointment,
  deleteAppointment,
  sendAppointmentConfirmationEmail,
  updateAppointment,
} from "@/app/actions/appointments";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Appointment = {
  id: string;
  customer_id: string | null;
  customer_name: string | null;
  service_name: string | null;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string | null;
};

type Customer = {
  id: string;
  name: string;
};

const statusOptions = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

const statusStyles: Record<string, string> = {
  pending: "border-text-secondary text-text-secondary",
  confirmed: "border-accent text-accent",
  completed: "border-success text-success",
  cancelled: "border-danger text-danger",
};

export function AppointmentList({
  initialAppointments,
  customers,
}: {
  initialAppointments: Appointment[];
  customers: Customer[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  function openModal(appointment?: Appointment) {
    setEditingAppointment(appointment ?? null);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditingAppointment(null);
  }

  async function handleSubmit(formData: FormData) {
    if (editingAppointment) {
      await updateAppointment(formData);
    } else {
      await createAppointment(formData);
    }
    closeModal();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this appointment? This cannot be undone.")) {
      return;
    }
    const formData = new FormData();
    formData.append("id", id);
    await deleteAppointment(formData);
    router.refresh();
  }

  async function handleSendConfirmation(id: string) {
    const formData = new FormData();
    formData.append("id", id);
    const result = await sendAppointmentConfirmationEmail(formData);
    if (result.sent) {
      alert("Confirmation email sent.");
    } else {
      alert("Could not send confirmation email. Make sure the customer has an email address.");
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-text-primary">
            Appointments
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Manage your schedule.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
        >
          New appointment
        </button>
      </div>

      {initialAppointments.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-12 text-center">
          <p className="text-text-primary">No appointments yet.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Add your first appointment to get started.
          </p>
          <button
            type="button"
            onClick={() => openModal()}
            className="mt-6 rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
          >
            Add appointment
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Service</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialAppointments.map((appointment: Appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 font-medium text-text-primary">
                    {appointment.customer_name ?? "Walk-in"}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {appointment.service_name ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {appointment.appointment_date}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {appointment.appointment_time}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[appointment.status]}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openModal(appointment)}
                      className="mr-4 text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendConfirmation(appointment.id)}
                      className="mr-4 text-sm text-text-secondary transition-colors hover:text-accent"
                    >
                      Send confirmation
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(appointment.id)}
                      className="text-sm text-text-secondary transition-colors hover:text-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-medium tracking-tight text-text-primary">
              {editingAppointment ? "Edit appointment" : "New appointment"}
            </h2>
            <form action={handleSubmit} className="mt-6 space-y-5">
              {editingAppointment && (
                <input
                  type="hidden"
                  name="id"
                  value={editingAppointment.id}
                />
              )}

              <div>
                <label
                  htmlFor="customer_id"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Customer
                </label>
                <select
                  id="customer_id"
                  name="customer_id"
                  defaultValue={editingAppointment?.customer_id ?? ""}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="">Walk-in / no customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="service_name"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Service
                </label>
                <input
                  id="service_name"
                  name="service_name"
                  type="text"
                  defaultValue={editingAppointment?.service_name ?? ""}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                  placeholder="e.g. Consultation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="appointment_date"
                    className="mb-2 block text-sm font-medium text-text-secondary"
                  >
                    Date
                  </label>
                  <input
                    id="appointment_date"
                    name="appointment_date"
                    type="date"
                    required
                    defaultValue={editingAppointment?.appointment_date ?? ""}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="appointment_time"
                    className="mb-2 block text-sm font-medium text-text-secondary"
                  >
                    Time
                  </label>
                  <input
                    id="appointment_time"
                    name="appointment_time"
                    type="time"
                    required
                    defaultValue={editingAppointment?.appointment_time ?? ""}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="duration_minutes"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Duration (minutes)
                </label>
                <input
                  id="duration_minutes"
                  name="duration_minutes"
                  type="number"
                  min={5}
                  defaultValue={
                    editingAppointment?.duration_minutes ?? 30
                  }
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={editingAppointment?.status ?? "pending"}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  defaultValue={editingAppointment?.notes ?? ""}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-md border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
                >
                  {editingAppointment ? "Save changes" : "Create appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
