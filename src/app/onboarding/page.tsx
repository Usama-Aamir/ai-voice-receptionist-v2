import { createClient } from "@/lib/supabase/server";
import { BusinessForm } from "@/components/onboarding/business-form";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: businessIds } = await supabase.rpc("user_business_ids");
  if (businessIds && businessIds.length > 0) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-full items-center justify-center px-4 py-12 bg-bg">
      <div className="w-full max-w-[480px] rounded-lg border border-border bg-surface p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight text-text-primary">
            Create your business
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Set up your workspace to start receiving calls.
          </p>
        </div>
        <BusinessForm />
      </div>
    </main>
  );
}
