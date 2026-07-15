import Link from "next/link";

const services = [
  {
    title: "Solmy AI Receptionist",
    description:
      "A multilingual AI receptionist for Malaysian SMEs. Answers customer questions, checks live availability, and books appointments automatically.",
    features: [
      "English, Bahasa Malaysia, Tamil & Chinese",
      "Chat + future WhatsApp/voice support",
      "Connects to your real services, hours, and calendar",
    ],
    cta: { label: "Get Solmy", href: "/signup" },
  },
  {
    title: "Custom AI Automation Agents",
    description:
      "Purpose-built AI agents that handle repetitive workflows specific to your business — not generic chatbots.",
    features: [
      "Document processing & data extraction",
      "Customer support & triage agents",
      "Integration with your existing tools",
    ],
    cta: { label: "Get a quote", href: "#quote" },
  },
  {
    title: "Custom Software Solutions",
    description:
      "Web apps, internal dashboards, APIs, and integrations built end-to-end for clinics, workshops, salons, and service businesses.",
    features: [
      "Next.js / React frontend development",
      "Supabase backend & database design",
      "Ongoing support & maintenance",
    ],
    cta: { label: "Get a quote", href: "#quote" },
  },
];

export function ServiceCards() {
  return (
    <section className="border-y border-border bg-surface px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
          Services
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
          AI and software built for the way you work.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col rounded-lg border border-border bg-bg p-6 transition-colors hover:border-text-secondary"
            >
              <h3 className="font-sans text-lg font-medium text-text-primary">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {service.description}
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={service.cta.href}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary hover:bg-surface"
              >
                {service.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
