"use client";

import { createKnowledgeBaseEntryFromFile } from "@/app/actions/knowledge-base";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function KnowledgeBaseUpload() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    setMessage(null);

    try {
      await createKnowledgeBaseEntryFromFile(formData);
      setMessage("Entry created from file.");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Failed to extract text from the file. Scanned or image-only PDFs may not contain extractable text.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="rounded-lg border border-border bg-surface p-6"
    >
      <h2 className="text-lg font-medium tracking-tight text-text-primary">
        Upload file
      </h2>
      <p className="mt-2 text-sm text-text-secondary">
        Extract text from a PDF or .txt file to create a knowledge base entry.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="upload-title"
            className="mb-2 block text-sm font-medium text-text-secondary"
          >
            Title (optional)
          </label>
          <input
            id="upload-title"
            name="title"
            type="text"
            className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
            placeholder="Defaults to the filename"
          />
        </div>

        <div>
          <label
            htmlFor="upload-category"
            className="mb-2 block text-sm font-medium text-text-secondary"
          >
            Category (optional)
          </label>
          <input
            id="upload-category"
            name="category"
            type="text"
            className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
            placeholder="e.g. FAQ"
          />
        </div>

        <div>
          <label
            htmlFor="upload-file"
            className="mb-2 block text-sm font-medium text-text-secondary"
          >
            File
          </label>
          <input
            id="upload-file"
            name="file"
            type="file"
            accept=".pdf,.txt"
            required
            className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:text-bg focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {message && (
        <p className="mt-5 text-sm text-text-secondary">{message}</p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isUploading}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90 disabled:opacity-60"
        >
          {isUploading ? "Extracting…" : "Upload and extract"}
        </button>
      </div>
    </form>
  );
}
