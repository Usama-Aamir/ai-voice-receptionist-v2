import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    const admin = createAdminClient();
    const { data: invites } = await admin
      .from("business_invites")
      .select("id, business_id, role")
      .eq("email", user.email.toLowerCase())
      .eq("accepted", false);

    for (const invite of invites ?? []) {
      const { error: memberError } = await admin
        .from("business_members")
        .insert({
          business_id: invite.business_id,
          user_id: user.id,
          role: invite.role,
        });

      if (memberError) {
        console.error(memberError);
        continue;
      }

      await admin
        .from("business_invites")
        .update({ accepted: true })
        .eq("id", invite.id);
    }
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
