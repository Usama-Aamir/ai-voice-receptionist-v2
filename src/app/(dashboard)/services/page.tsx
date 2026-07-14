import { ServiceList } from "@/components/services/service-list";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: services } = await supabase
    .from("services")
    .select("id, name, description, price, duration_minutes, is_active")
    .order("name", { ascending: true });

  return <ServiceList initialServices={services ?? []} />;
}
