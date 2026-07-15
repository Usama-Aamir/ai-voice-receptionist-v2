import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Logo variant="icon" />
          <p className="mt-2 text-sm text-text-secondary">
            Built by AISS AI Software Solutions Sdn. Bhd.
          </p>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Registration No: 972797-X
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            <a
              href="mailto:info@aiss.my"
              className="transition-colors hover:text-text-primary"
            >
              info@aiss.my
            </a>
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Sign up
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-text-secondary">
        © 2026 AISS AI Software Solutions Sdn. Bhd. (972797-X). All rights
        reserved.
      </p>
    </footer>
  );
}
