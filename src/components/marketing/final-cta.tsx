import Link from "next/link";

export function FinalCta() {
  return (
    <section className="border-y border-border bg-surface px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
          Stop losing customers to missed calls.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-text-secondary">
          Set up Solmy in minutes and let your AI receptionist handle the first
          conversation — in any language your customer speaks.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-accent px-8 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
