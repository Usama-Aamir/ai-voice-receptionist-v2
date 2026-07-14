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

export async function saveBusinessHours(formData: FormData) {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const hours = [];
  for (let day = 0; day <= 6; day++) {
    const isClosed = formData.get(`is_closed_${day}`) === "on";
    const openTime = (formData.get(`open_time_${day}`) as string) || null;
    const closeTime = (formData.get(`close_time_${day}`) as string) || null;

    hours.push({
      business_id: businessId,
      day_of_week: day,
      open_time: isClosed ? null : openTime,
      close_time: isClosed ? null : closeTime,
      is_closed: isClosed,
    });
  }

  const { error } = await supabase.from("business_hours").upsert(hours, {
    onConflict: "business_id,day_of_week",
  });

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/settings/hours", "page");
  revalidatePath("/(dashboard)/settings", "page");
}

export async function addClosure(formData: FormData) {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const closureDate = formData.get("closure_date") as string;
  const reason = (formData.get("reason") as string) || null;

  const { error } = await supabase.from("business_closures").insert({
    business_id: businessId,
    closure_date: closureDate,
    reason,
  });

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/settings/hours", "page");
}

export async function deleteClosure(formData: FormData) {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("business_closures")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/settings/hours", "page");
}
