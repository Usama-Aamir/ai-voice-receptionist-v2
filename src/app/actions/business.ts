"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export async function createBusiness(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const slug = slugify(name);
  const timezone = (formData.get("timezone") as string) || "Asia/Kuala_Lumpur";
  const languages = formData.getAll("languages") as string[];

  const admin = createAdminClient();

  const { data: business, error: businessError } = await admin
    .from("businesses")
    .insert({ name, slug, timezone, languages })
    .select("id")
    .single();

  if (businessError) {
    console.error(businessError);
    redirect("/onboarding");
  }

  const { error: memberError } = await admin.from("business_members").insert({
    business_id: business.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    console.error(memberError);
    redirect("/onboarding");
  }

  revalidatePath("/(dashboard)", "layout");
  redirect("/dashboard");
}

export async function updateBusiness(
  _prevState: { message: string; error: boolean },
  formData: FormData
) {
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

  const name = formData.get("name") as string;
  const phone = (formData.get("phone") as string) || null;
  const email = (formData.get("email") as string) || null;
  const address = (formData.get("address") as string) || null;
  const website = (formData.get("website") as string) || null;
  const timezone = (formData.get("timezone") as string) || "Asia/Kuala_Lumpur";
  const languages = formData.getAll("languages") as string[];

  const { error } = await supabase
    .from("businesses")
    .update({
      name,
      phone,
      email,
      address,
      website,
      timezone,
      languages,
    })
    .eq("id", businessId);

  if (error) {
    console.error(error);
    return { error: true, message: `Could not save profile: ${error.message}` };
  }

  revalidatePath("/settings", "page");
  revalidatePath("/dashboard", "page");

  return { error: false, message: "Profile saved successfully." };
}
