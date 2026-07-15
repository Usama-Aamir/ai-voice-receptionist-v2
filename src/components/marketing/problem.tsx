const callouts = [
  {
    stat: "Missed calls",
    text: "Every unanswered call is a potential appointment that goes to a competitor.",
  },
  {
    stat: "No callbacks",
    text: "Most customers who can’t reach you the first time never call back.",
  },
  {
    stat: "Language gaps",
    text: "Language barriers lose customers before they even ask a question.",
  },
];

export function Problem() {
  return (
    <section className="border-y border-border bg-surface px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
          The Problem
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {callouts.map((item) => (
            <div
              key={item.stat}
              className="rounded-lg border border-border bg-bg p-6"
            >
              <h3 className="font-sans text-lg font-medium text-text-primary">
                {item.stat}
              </h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
