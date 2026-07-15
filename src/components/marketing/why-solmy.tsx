const differentiators = [
  {
    title: "Built for Malaysian SMEs",
    description:
      "English, Bahasa Malaysia, Tamil, and Chinese — the languages your customers actually use. Not a generic enterprise platform built for call centers.",
  },
  {
    title: "Works everywhere",
    description: "Chat today. WhatsApp and phone calls are coming next.",
  },
  {
    title: "Never invents information",
    description: "Solmy answers only from what you actually tell it.",
  },
  {
    title: "You stay in control",
    description: "Every conversation and booking is visible in your dashboard.",
  },
];

export function WhySolmy() {
  return (
    <section className="border-y border-border bg-surface px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
          Why Solmy
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
          Built for local businesses, not enterprise complexity.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-bg p-6"
            >
              <h3 className="font-sans text-lg font-medium text-text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
