import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthCard({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-full items-center justify-center px-4 py-12 bg-bg">
      <div className="w-full max-w-[420px] rounded-lg border border-border bg-surface p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight text-text-primary">
            {title}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
        </div>
        {children}
      </div>
    </main>
  );
}
