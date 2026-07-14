"use client";

import { createBusiness } from "@/app/actions/business";
import { useState } from "react";

const languages = [
  { id: "English", label: "English" },
  { id: "Bahasa Malaysia", label: "Bahasa Malaysia" },
];

export function BusinessForm() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "English",
  ]);

  function toggleLanguage(language: string) {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  }

  return (
    <form action={createBusiness} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-text-secondary"
        >
          Business name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoFocus
          className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
          placeholder="Acme Sdn Bhd"
        />
      </div>

      <div>
        <label
          htmlFor="timezone"
          className="mb-2 block text-sm font-medium text-text-secondary"
        >
          Timezone
        </label>
        <select
          id="timezone"
          name="timezone"
          defaultValue="Asia/Kuala_Lumpur"
          className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
        >
          <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur</option>
          <option value="Asia/Singapore">Asia/Singapore</option>
          <option value="Asia/Jakarta">Asia/Jakarta</option>
          <option value="Asia/Bangkok">Asia/Bangkok</option>
          <option value="Asia/Manila">Asia/Manila</option>
        </select>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-text-secondary">
          Languages
        </span>
        <div className="space-y-3">
          {languages.map((language) => (
            <label
              key={language.id}
              className="flex items-center gap-3 text-sm text-text-primary"
            >
              <input
                type="checkbox"
                name="languages"
                value={language.id}
                checked={selectedLanguages.includes(language.id)}
                onChange={() => toggleLanguage(language.id)}
                className="h-4 w-4 rounded border-border bg-bg text-accent focus:ring-accent focus:ring-offset-0"
              />
              {language.label}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
      >
        Create business
      </button>
    </form>
  );
}
