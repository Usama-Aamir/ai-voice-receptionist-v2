"use client";

import {
  createService,
  deleteService,
  updateService,
} from "@/app/actions/services";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  duration_minutes: number;
  is_active: boolean;
};

export function ServiceList({ initialServices }: { initialServices: Service[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  function openModal(service?: Service) {
    setEditingService(service ?? null);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditingService(null);
  }

  async function handleSubmit(formData: FormData) {
    if (editingService) {
      await updateService(formData);
    } else {
      await createService(formData);
    }
    closeModal();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this service? This cannot be undone.")) {
      return;
    }
    const formData = new FormData();
    formData.append("id", id);
    await deleteService(formData);
    router.refresh();
  }

  function formatPrice(price: number | null) {
    if (price === null || Number.isNaN(price)) return "—";
    return `RM ${price.toFixed(2)}`;
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-text-primary">
            Services
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Manage the services your AI receptionist can book.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
        >
          New service
        </button>
      </div>

      {initialServices.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-12 text-center">
          <p className="text-text-primary">No services yet.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Add services customers can book.
          </p>
          <button
            type="button"
            onClick={() => openModal()}
            className="mt-6 rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
          >
            Add service
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Active</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialServices.map((service: Service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 font-medium text-text-primary">
                    {service.name}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {service.description ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {formatPrice(service.price)}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {service.duration_minutes} min
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        service.is_active
                          ? "border-success text-success"
                          : "border-text-secondary text-text-secondary"
                      }`}
                    >
                      {service.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openModal(service)}
                      className="mr-4 text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(service.id)}
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
              {editingService ? "Edit service" : "New service"}
            </h2>
            <form action={handleSubmit} className="mt-6 space-y-5">
              {editingService && (
                <input type="hidden" name="id" value={editingService.id} />
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
                  defaultValue={editingService?.name ?? ""}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                  placeholder="e.g. Consultation"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={editingService?.description ?? ""}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                  placeholder="Brief description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-text-secondary"
                  >
                    Price (RM)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    step={0.01}
                    defaultValue={editingService?.price ?? ""}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label
                    htmlFor="duration_minutes"
                    className="mb-2 block text-sm font-medium text-text-secondary"
                  >
                    Duration (min)
                  </label>
                  <input
                    id="duration_minutes"
                    name="duration_minutes"
                    type="number"
                    min={5}
                    defaultValue={editingService?.duration_minutes ?? 30}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={editingService?.is_active ?? true}
                    className="h-4 w-4 rounded border-border bg-bg text-accent focus:ring-0"
                  />
                  Active
                </label>
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
                  {editingService ? "Save changes" : "Create service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
