"use client";

import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { useState } from "react";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="Solmy home">
          <Logo variant="full" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#how-it-works"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            How it works
          </Link>
          <Link
            href="/solutions"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Services
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary hover:bg-surface"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
          >
            Get Started
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-primary md:hidden"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="#how-it-works"
              onClick={() => setOpen(false)}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              How it works
            </Link>
            <Link
              href="/solutions"
              onClick={() => setOpen(false)}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Services
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
