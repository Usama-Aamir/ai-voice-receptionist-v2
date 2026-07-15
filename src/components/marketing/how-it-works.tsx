const steps = [
  {
    number: "01",
    title: "Customer reaches out",
    description: "They message your business anytime, day or night.",
  },
  {
    number: "02",
    title: "Solmy answers instantly",
    description:
      "It replies from your real knowledge base — hours, pricing, services — and never invents information.",
  },
  {
    number: "03",
    title: "Books the appointment",
    description:
      "Solmy checks live availability and schedules directly into your calendar.",
  },
  {
    number: "04",
    title: "You stay informed",
    description: "Every conversation and booking appears in one dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
          How It Works
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
          From first message to confirmed booking, automatically.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-lg border border-border bg-surface p-6"
            >
              <span className="font-mono text-sm text-accent">{step.number}</span>
              <h3 className="mt-4 font-sans text-lg font-medium text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
