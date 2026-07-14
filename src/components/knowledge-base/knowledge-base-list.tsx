"use client";

import {
  createKnowledgeBaseEntry,
  deleteKnowledgeBaseEntry,
  updateKnowledgeBaseEntry,
} from "@/app/actions/knowledge-base";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Entry = {
  id: string;
  title: string;
  category: string | null;
  content: string;
};

export function KnowledgeBaseList({ initialEntries }: { initialEntries: Entry[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  function openModal(entry?: Entry) {
    setEditingEntry(entry ?? null);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditingEntry(null);
  }

  async function handleSubmit(formData: FormData) {
    if (editingEntry) {
      await updateKnowledgeBaseEntry(formData);
    } else {
      await createKnowledgeBaseEntry(formData);
    }
    closeModal();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this entry? This cannot be undone.")) {
      return;
    }
    const formData = new FormData();
    formData.append("id", id);
    await deleteKnowledgeBaseEntry(formData);
    router.refresh();
  }

  function truncate(text: string, length: number) {
    if (text.length <= length) return text;
    return text.slice(0, length).trim() + "…";
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-text-primary">
            Knowledge base
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Information your AI receptionist uses to answer questions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
        >
          Add entry
        </button>
      </div>

      {initialEntries.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-12 text-center">
          <p className="text-text-primary">No knowledge entries yet.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Add FAQs and service details for your AI receptionist.
          </p>
          <button
            type="button"
            onClick={() => openModal()}
            className="mt-6 rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
          >
            Add entry
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-border bg-surface p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-medium text-text-primary">
                  {entry.title}
                </h3>
                {entry.category && (
                  <span className="inline-flex shrink-0 items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium text-text-secondary">
                    {entry.category}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {truncate(entry.content, 140)}
              </p>
              <div className="mt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => openModal(entry)}
                  className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  className="text-sm text-text-secondary transition-colors hover:text-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-medium tracking-tight text-text-primary">
              {editingEntry ? "Edit entry" : "Add entry"}
            </h2>
            <form action={handleSubmit} className="mt-6 space-y-5">
              {editingEntry && (
                <input type="hidden" name="id" value={editingEntry.id} />
              )}

              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={editingEntry?.title ?? ""}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                  placeholder="e.g. Opening hours"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  defaultValue={editingEntry?.category ?? ""}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                  placeholder="e.g. General"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={8}
                  required
                  defaultValue={editingEntry?.content ?? ""}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                  placeholder="Write the answer or information your AI receptionist should use..."
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
                  {editingEntry ? "Save changes" : "Add entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
