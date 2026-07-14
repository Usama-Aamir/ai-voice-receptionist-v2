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

export async function createCustomer(formData: FormData) {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = (formData.get("email") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const interestedService =
    (formData.get("interested_service") as string) || null;
  const status = (formData.get("status") as string) || "new";

  const { error } = await supabase.from("customers").insert({
    business_id: businessId,
    name,
    email,
    phone,
    notes,
    interested_service: interestedService,
    status,
  });

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/customers", "page");
}

export async function updateCustomer(formData: FormData) {
  await getCurrentBusinessId();
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const interestedService =
    (formData.get("interested_service") as string) || null;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("customers")
    .update({
      name,
      email,
      phone,
      notes,
      interested_service: interestedService,
      status,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/customers", "page");
}

export async function deleteCustomer(formData: FormData) {
  await getCurrentBusinessId();
  const supabase = await createClient();

  const id = formData.get("id") as string;

  const { error } = await supabase.from("customers").delete().eq("id", id);

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/customers", "page");
}
