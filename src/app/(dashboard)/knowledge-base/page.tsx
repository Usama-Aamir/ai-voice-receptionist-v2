import { KnowledgeBaseList } from "@/components/knowledge-base/knowledge-base-list";
import { KnowledgeBaseUpload } from "@/components/knowledge-base/knowledge-base-upload";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function KnowledgeBasePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: entries } = await supabase
    .from("knowledge_base")
    .select("id, title, category, content")
    .order("created_at", { ascending: false });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
      <KnowledgeBaseList initialEntries={entries ?? []} />
      <KnowledgeBaseUpload />
    </div>
  );
}
