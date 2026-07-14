"use server";

import { createAdminClient } from "@/lib/supabase/admin";
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

export async function createInvite(formData: FormData) {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const email = (formData.get("email") as string).toLowerCase().trim();
  const role = formData.get("role") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("business_invites").insert({
    business_id: businessId,
    email,
    role,
    invited_by: user.id,
  });

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/settings", "page");
}

export async function cancelInvite(formData: FormData) {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("business_invites")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    console.error(error);
  }

  revalidatePath("/(dashboard)/settings", "page");
}

export async function getTeamMembers(businessId: string) {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("business_members")
    .select("user_id, role")
    .eq("business_id", businessId);

  const userIds = (members ?? []).map((member) => member.user_id);
  if (userIds.length === 0) {
    return [];
  }

  const admin = createAdminClient();
  const { data: users } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  const emailByUserId = new Map(
    (users.users ?? [])
      .filter((user) => userIds.includes(user.id))
      .map((user) => [user.id, user.email])
  );

  return (members ?? []).map((member) => ({
    userId: member.user_id,
    role: member.role,
    email: emailByUserId.get(member.user_id) ?? "",
  }));
}
