"use client";

import { useState } from "react";

export function PublicChatLink({ slug }: { slug: string }) {
  const [origin] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  );
  const [copied, setCopied] = useState(false);

  const link = origin ? `${origin}/chat/${slug}` : "";

  async function copyToClipboard() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h2 className="text-lg font-medium tracking-tight text-text-primary">
        Your public chat link
      </h2>
      <p className="mt-2 text-sm text-text-secondary">
        Share this link with customers so they can chat with your AI receptionist.
      </p>

      <div className="mt-5 flex items-center gap-3">
        <input
          type="text"
          readOnly
          value={link || "Loading…"}
          className="flex-1 rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
        />
        <button
          type="button"
          onClick={copyToClipboard}
          disabled={!link}
          className="rounded-md border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary disabled:opacity-60"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
