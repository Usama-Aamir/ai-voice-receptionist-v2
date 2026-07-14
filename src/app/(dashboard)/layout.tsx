import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: businessIds } = await supabase.rpc("user_business_ids");
  if (!businessIds || businessIds.length === 0) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-full bg-bg">
      <Sidebar />
      <div className="pl-64">
        <main className="min-h-full p-8">{children}</main>
      </div>
    </div>
  );
}
