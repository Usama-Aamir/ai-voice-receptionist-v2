const industries = [
  "Dental & Medical Clinics",
  "Car Workshops",
  "Salons",
  "Restaurants",
  "Law Firms",
  "Recruitment Agencies",
];

export function Industries() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
          Who It&apos;s For
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
          Built for service businesses that run on appointments.
        </h2>
        <div className="mt-10 flex flex-wrap gap-3">
          {industries.map((industry) => (
            <span
              key={industry}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-primary"
            >
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
