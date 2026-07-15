"use client";

import { useState } from "react";

export function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "ai-agent",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Quote request: ${form.service === "ai-agent" ? "Custom AI Agent" : form.service === "software" ? "Custom Software" : "AI + Software"}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nInterested in: ${form.service}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:info@aiss.my?subject=${subject}&body=${body}`;
  };

  return (
    <section id="quote" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
          Get a Quote
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
          Tell us what you need.
        </h2>
        <p className="mt-3 text-text-secondary">
          We&apos;ll reply within one business day with next steps and a rough scope.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5 rounded-lg border border-border bg-surface p-6 md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="quote-name"
                className="block text-sm font-medium text-text-primary"
              >
                Name
              </label>
              <input
                id="quote-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 block w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="quote-email"
                className="block text-sm font-medium text-text-primary"
              >
                Email
              </label>
              <input
                id="quote-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 block w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="quote-company"
              className="block text-sm font-medium text-text-primary"
            >
              Company
            </label>
            <input
              id="quote-company"
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="mt-2 block w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
              placeholder="Your business name"
            />
          </div>

          <div>
            <label
              htmlFor="quote-service"
              className="block text-sm font-medium text-text-primary"
            >
              What are you looking for?
            </label>
            <select
              id="quote-service"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="mt-2 block w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            >
              <option value="ai-agent">Custom AI automation agent</option>
              <option value="software">Custom software solution</option>
              <option value="both">Both — AI agent + custom software</option>
              <option value="solmy">Solmy AI Receptionist</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="quote-message"
              className="block text-sm font-medium text-text-primary"
            >
              Project details
            </label>
            <textarea
              id="quote-message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 block w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
              placeholder="Describe the problem you want to solve..."
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-accent px-8 text-sm font-medium text-bg transition-colors hover:bg-accent/90 sm:w-auto"
          >
            Request a quote
          </button>
        </form>
      </div>
    </section>
  );
}
