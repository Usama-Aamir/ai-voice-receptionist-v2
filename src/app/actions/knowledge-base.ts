"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type PdfParseFn = (buffer: Buffer) => Promise<{ text: string }>;

async function getCurrentBusinessId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: businessIds } = await supabase.rpc("user_business_ids");
  const businessId = (businessIds ?? [])[0];

  if (!businessId) {
    redirect("/onboarding");
  }

  return businessId;
}

export async function createKnowledgeBaseEntry(formData: FormData) {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const category = (formData.get("category") as string) || null;
  const content = formData.get("content") as string;

  const { error } = await supabase.from("knowledge_base").insert({
    business_id: businessId,
    title,
    category,
    content,
  });

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/knowledge-base", "page");
}

export async function createKnowledgeBaseEntryFromFile(formData: FormData) {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const title = (formData.get("title") as string) || null;
  const category = (formData.get("category") as string) || null;
  const file = formData.get("file") as File | null;

  if (!file) {
    console.error("No file provided");
    return;
  }

  let content = "";
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    const isText =
      file.type === "text/plain" ||
      file.name.toLowerCase().endsWith(".txt");

    if (isPdf) {
      const pdfParse = (await import("pdf-parse")) as unknown as PdfParseFn;
      const result = await pdfParse(buffer);
      content = result.text;
    } else if (isText) {
      content = buffer.toString("utf-8");
    } else {
      console.error("Unsupported file type");
      return;
    }
  } catch (error) {
    console.error(error);
    return;
  }

  if (!content.trim()) {
    console.error("No extractable text found");
    return;
  }

  const { error } = await supabase.from("knowledge_base").insert({
    business_id: businessId,
    title: title || file.name,
    category,
    content,
  });

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/knowledge-base", "page");
}

export async function updateKnowledgeBaseEntry(formData: FormData) {
  await getCurrentBusinessId();
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const category = (formData.get("category") as string) || null;
  const content = formData.get("content") as string;

  const { error } = await supabase
    .from("knowledge_base")
    .update({ title, category, content })
    .eq("id", id);

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/knowledge-base", "page");
}

export async function deleteKnowledgeBaseEntry(formData: FormData) {
  await getCurrentBusinessId();
  const supabase = await createClient();

  const id = formData.get("id") as string;

  const { error } = await supabase.from("knowledge_base").delete().eq("id", id);

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/knowledge-base", "page");
}
