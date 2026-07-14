import { ChatWidget } from "@/components/chat/chat-widget";
import { createAdminClient } from "@/lib/supabase/admin";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data: business } = await admin
    .from("businesses")
    .select("name")
    .eq("slug", slug)
    .single();

  return {
    title: business?.name ?? "AI Receptionist",
  };
}

export default async function PublicChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: business } = await admin
    .from("businesses")
    .select("id, name, phone")
    .eq("slug", slug)
    .single();

  if (!business) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-bg">
      <div className="flex h-screen flex-col">
        <div className="border-b border-border bg-surface px-6 py-4">
          <h1 className="text-lg font-medium tracking-tight text-text-primary">
            {business.name}
          </h1>
          <p className="text-sm text-text-secondary">AI receptionist</p>
        </div>
        <div className="flex-1">
          <ChatWidget
            businessId={business.id}
            fullPage
            businessName={business.name}
            businessPhone={business.phone}
            placeholder="Type in English, Bahasa Malaysia, Tamil, or Chinese…"
          />
        </div>
      </div>
    </main>
  );
}
