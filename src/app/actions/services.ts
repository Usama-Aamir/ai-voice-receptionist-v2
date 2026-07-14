"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function createService(formData: FormData) {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const price =
    parseFloat(formData.get("price") as string) || null;
  const durationMinutes =
    parseInt(formData.get("duration_minutes") as string, 10) || 30;
  const isActive = formData.get("is_active") === "on";

  const { error } = await supabase.from("services").insert({
    business_id: businessId,
    name,
    description,
    price,
    duration_minutes: durationMinutes,
    is_active: isActive,
  });

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/services", "page");
}

export async function updateService(formData: FormData) {
  await getCurrentBusinessId();
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const price =
    parseFloat(formData.get("price") as string) || null;
  const durationMinutes =
    parseInt(formData.get("duration_minutes") as string, 10) || 30;
  const isActive = formData.get("is_active") === "on";

  const { error } = await supabase
    .from("services")
    .update({ name, description, price, duration_minutes: durationMinutes, is_active: isActive })
    .eq("id", id);

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/services", "page");
}

export async function deleteService(formData: FormData) {
  await getCurrentBusinessId();
  const supabase = await createClient();

  const id = formData.get("id") as string;

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/services", "page");
}
