"use client";

import { updateBusiness } from "@/app/actions/business";
import { useFormState, useFormStatus } from "react-dom";

const timezones = [
  "Asia/Kuala_Lumpur",
  "Asia/Singapore",
  "Asia/Bangkok",
  "Asia/Jakarta",
  "Asia/Manila",
  "Asia/Hong_Kong",
  "Asia/Tokyo",
  "Australia/Perth",
  "UTC",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90 disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save profile"}
    </button>
  );
}

export function BusinessProfileForm({
  business,
}: {
  business: {
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    website: string | null;
    timezone: string;
    languages: string[];
  };
}) {
  const [state, formAction] = useFormState(updateBusiness, {
    error: false,
    message: "",
  });

  return (
    <form
      action={formAction}
      className="rounded-lg border border-border bg-surface p-6"
    >
      <div className="space-y-5">
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
            defaultValue={business.name}
            className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Phone / voice receptionist number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={business.phone ?? ""}
              placeholder="+60 12-345 6789"
              className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
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
              defaultValue={business.email ?? ""}
              className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-text-secondary"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            defaultValue={business.address ?? ""}
            className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="website"
            className="mb-2 block text-sm font-medium text-text-secondary"
          >
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            defaultValue={business.website ?? ""}
            placeholder="https://example.com"
            className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
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
            defaultValue={business.timezone ?? "Asia/Kuala_Lumpur"}
            className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
          >
            {timezones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-text-secondary">
            Languages
          </span>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                name="languages"
                value="English"
                defaultChecked={business.languages?.includes("English") ?? true}
                className="h-4 w-4 rounded border-border bg-bg text-accent focus:ring-0"
              />
              English
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                name="languages"
                value="Bahasa Malaysia"
                defaultChecked={
                  business.languages?.includes("Bahasa Malaysia") ?? false
                }
                className="h-4 w-4 rounded border-border bg-bg text-accent focus:ring-0"
              />
              Bahasa Malaysia
            </label>
          </div>
        </div>
      </div>

      {state?.message && (
        <p
          className={`mt-6 text-sm ${
            state.error ? "text-danger" : "text-text-secondary"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
