import { HeroVisual } from "@/components/marketing/hero-visual";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-24 pb-20 text-center md:pt-32 md:pb-28">
      <div className="max-w-3xl">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-wide text-text-secondary">
          AI Receptionist for Malaysian Businesses
        </p>
        <h1 className="font-sans text-5xl font-semibold tracking-tight text-accent md:text-6xl lg:text-7xl">
          Solmy
        </h1>
        <p className="mt-6 text-lg leading-8 text-text-secondary md:text-xl">
          The AI receptionist that never misses a call — in English, Bahasa
          Malaysia, Tamil, and Chinese.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-text-secondary md:text-base">
          Missed calls and slow replies cost real revenue. Solmy is built for
          Malaysian small businesses: it answers instantly in the languages
          your customers actually use, checks real availability, and books
          appointments automatically.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-8 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
          >
            Get Started
          </Link>
          <Link
            href="#demo"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-transparent px-8 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary hover:bg-surface"
          >
            See a live demo
          </Link>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
