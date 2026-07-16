import { ChatWidget } from "@/components/chat/chat-widget";
import { VoiceCard } from "@/components/dashboard/voice-card";
import { createClient } from "@/lib/supabase/server";

function todayInTimezone(timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function getStatCounts() {
  const supabase = await createClient();

  const { data: businessIds } = await supabase.rpc("user_business_ids");
  const ids = ((businessIds ?? []) as string[]).filter(Boolean);

  if (ids.length === 0) {
    return {
      todaysAppointments: 0,
      pendingAppointments: 0,
      weeklyConversations: 0,
      totalCustomers: 0,
      businessPhone: null,
    };
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("timezone, phone")
    .in("id", ids)
    .limit(1)
    .single();
  const timezone = business?.timezone ?? "UTC";
  const today = todayInTimezone(timezone);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  let todaysAppointments = 0;
  let pendingAppointments = 0;
  let weeklyConversations = 0;
  let totalCustomers = 0;

  try {
    const { count } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .in("business_id", ids)
      .eq("appointment_date", today);
    todaysAppointments = count ?? 0;
  } catch {
    todaysAppointments = 0;
  }

  try {
    const { count } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .in("business_id", ids)
      .eq("status", "pending");
    pendingAppointments = count ?? 0;
  } catch {
    pendingAppointments = 0;
  }

  try {
    const { count } = await supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .in("business_id", ids)
      .gte("created_at", sevenDaysAgo.toISOString());
    weeklyConversations = count ?? 0;
  } catch {
    weeklyConversations = 0;
  }

  try {
    const { count } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .in("business_id", ids);
    totalCustomers = count ?? 0;
  } catch {
    totalCustomers = 0;
  }

  return {
    todaysAppointments,
    pendingAppointments,
    weeklyConversations,
    totalCustomers,
    businessPhone: business?.phone ?? null,
  };
}

export default async function DashboardPage() {
  const counts = await getStatCounts();
  const supabase = await createClient();
  const { data: businessIds } = await supabase.rpc("user_business_ids");
  const businessId = ((businessIds ?? []) as string[])[0];

  const stats = [
    { label: "Today's appointments", value: counts.todaysAppointments },
    { label: "Pending appointments", value: counts.pendingAppointments },
    { label: "Conversations this week", value: counts.weeklyConversations },
    { label: "Total customers", value: counts.totalCustomers },
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-medium tracking-tight text-text-primary">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Overview of your business activity.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <p className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
              {stat.label}
            </p>
            <p className="mt-3 font-mono text-3xl font-medium text-text-primary">
              {stat.value}
            </p>
          </div>
        ))}
        <VoiceCard phone={counts.businessPhone} />
      </div>

      {businessId && (
        <ChatWidget
          businessId={businessId}
          placeholder="Type in English, Bahasa Malaysia, Tamil, or Chinese…"
        />
      )}
    </div>
  );
}
