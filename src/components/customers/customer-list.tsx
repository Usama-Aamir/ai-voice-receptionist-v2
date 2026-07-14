"use client";

import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "@/app/actions/customers";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  interested_service: string | null;
  status: "new" | "contacted" | "booked" | "completed" | "lost";
  created_at: string;
};

const statusOptions = [
  "new",
  "contacted",
  "booked",
  "completed",
  "lost",
] as const;

const statusStyles: Record<string, string> = {
  new: "border-text-secondary text-text-secondary",
  contacted: "border-accent text-accent",
  booked: "border-success text-success",
  completed: "border-success text-success",
  lost: "border-danger text-danger",
};

export function CustomerList({
  initialCustomers,
}: {
  initialCustomers: Customer[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  function openModal(customer?: Customer) {
    setEditingCustomer(customer ?? null);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditingCustomer(null);
  }

  async function handleSubmit(formData: FormData) {
    if (editingCustomer) {
      await updateCustomer(formData);
    } else {
      await createCustomer(formData);
    }
    closeModal();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this customer? This cannot be undone.")) {
      return;
    }
    const formData = new FormData();
    formData.append("id", id);
    await deleteCustomer(formData);
    router.refresh();
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-text-primary">
            Customers
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Manage your customer relationships.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
        >
          New customer
        </button>
      </div>

      {initialCustomers.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-12 text-center">
          <p className="text-text-primary">No customers yet.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Add your first customer to get started.
          </p>
          <button
            type="button"
            onClick={() => openModal()}
            className="mt-6 rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
          >
            Add customer
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Interested service</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialCustomers.map((customer: Customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 font-medium text-text-primary">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {customer.phone ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {customer.email ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {customer.interested_service ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[customer.status]}`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openModal(customer)}
                      className="mr-4 text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(customer.id)}
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
              {editingCustomer ? "Edit customer" : "New customer"}
            </h2>
            <form action={handleSubmit} className="mt-6 space-y-5">
              {editingCustomer && (
                <input type="hidden" name="id" value={editingCustomer.id} />
              )}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editingCustomer?.name ?? ""}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                  placeholder="Customer name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-text-secondary"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={editingCustomer?.phone ?? ""}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                    placeholder="+60 12 345 6789"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-text-secondary"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={editingCustomer?.email ?? ""}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                    placeholder="customer@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="interested_service"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Interested service
                </label>
                <input
                  id="interested_service"
                  name="interested_service"
                  type="text"
                  defaultValue={editingCustomer?.interested_service ?? ""}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                  placeholder="e.g. Teeth whitening"
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
                  defaultValue={editingCustomer?.status ?? "new"}
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
                  defaultValue={editingCustomer?.notes ?? ""}
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
                  {editingCustomer ? "Save changes" : "Create customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
