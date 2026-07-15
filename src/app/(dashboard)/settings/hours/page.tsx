import {
  BusinessHoursForm,
  ClosuresSection,
} from "@/components/settings/business-hours-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function BusinessHoursPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: businessIds } = await supabase.rpc("user_business_ids");
  const businessId = ((businessIds ?? []) as string[])[0];

  if (!businessId) {
    redirect("/onboarding");
  }

  const { data: hours } = await supabase
    .from("business_hours")
    .select("day_of_week, open_time, close_time, is_closed")
    .eq("business_id", businessId)
    .order("day_of_week", { ascending: true });

  const { data: closures } = await supabase
    .from("business_closures")
    .select("id, closure_date, reason")
    .eq("business_id", businessId)
    .gte("closure_date", new Date().toISOString().split("T")[0])
    .order("closure_date", { ascending: true });

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight text-text-primary">
          Business hours
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Set your weekly operating hours.
        </p>
      </div>

      <BusinessHoursForm hours={hours ?? []} />
      <ClosuresSection closures={closures ?? []} />
    </div>
  );
}
