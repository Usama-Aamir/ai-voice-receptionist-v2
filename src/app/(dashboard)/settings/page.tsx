import { updateBusiness } from "@/app/actions/business";
import { cancelInvite, createInvite, getTeamMembers } from "@/app/actions/team";
import { PublicChatLink } from "@/components/settings/public-chat-link";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const timezones = [
  "Asia/Kuala_Lumpur",
  "Asia/Singapore",
  "Asia/Bangkok",
  "Asia/Jakarta",
  "Asia/Manila",
  "Asia/Hong_Kong",
  "Asia/Tokyo",
  "Australia/Perth",
  "UTC",
];

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: businessIds } = await supabase.rpc("user_business_ids");
  const businessId = ((businessIds ?? []) as string[])[0];

  if (!businessId) {
    redirect("/onboarding");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("name, slug, phone, email, address, website, timezone, languages")
    .eq("id", businessId)
    .single();

  const members = await getTeamMembers(businessId);

  const { data: pendingInvites } = await supabase
    .from("business_invites")
    .select("id, email, role, accepted")
    .eq("business_id", businessId)
    .eq("accepted", false)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-text-primary">
          Settings
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage your business profile and operating hours.
        </p>
      </div>

      {business?.slug && <PublicChatLink slug={business.slug} />}

      <form
        action={updateBusiness}
        className="rounded-lg border border-border bg-surface p-6"
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Business name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={business?.name ?? ""}
              className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={business?.phone ?? ""}
                className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={business?.email ?? ""}
                className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              defaultValue={business?.address ?? ""}
              className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              defaultValue={business?.website ?? ""}
              className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label
              htmlFor="timezone"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              defaultValue={business?.timezone ?? "Asia/Kuala_Lumpur"}
              className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            >
              {timezones.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-text-secondary">
              Languages
            </span>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  name="languages"
                  value="English"
                  defaultChecked={business?.languages?.includes("English") ?? true}
                  className="h-4 w-4 rounded border-border bg-bg text-accent focus:ring-0"
                />
                English
              </label>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  name="languages"
                  value="Bahasa Malaysia"
                  defaultChecked={
                    business?.languages?.includes("Bahasa Malaysia") ?? false
                  }
                  className="h-4 w-4 rounded border-border bg-bg text-accent focus:ring-0"
                />
                Bahasa Malaysia
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
          >
            Save profile
          </button>
        </div>
      </form>

      <div className="mt-8 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium tracking-tight text-text-primary">
          Business hours
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Set the days and times your business is open.
        </p>
        <div className="mt-4">
          <Link
            href="/settings/hours"
            className="text-sm text-accent transition-colors hover:text-accent/80"
          >
            Manage business hours →
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium tracking-tight text-text-primary">
          Team
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Manage who can access this business dashboard.
        </p>

        <div className="mt-5">
          <h3 className="text-sm font-medium text-text-secondary">
            Current members
          </h3>
          {members.length === 0 ? (
            <p className="mt-2 text-sm text-text-secondary">No team members.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border border-t border-border">
              {members.map((member) => (
                <li
                  key={member.userId}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm text-text-primary">{member.email}</p>
                    <p className="text-sm text-text-secondary capitalize">
                      {member.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form action={createInvite} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            type="email"
            name="email"
            placeholder="teammate@company.com"
            required
            className="rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
          />
          <select
            name="role"
            required
            className="rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="rounded-md border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary"
          >
            Invite teammate
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-text-secondary">
            Pending invites
          </h3>
          {(pendingInvites ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-text-secondary">
              No pending invites.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border border-t border-border">
              {(pendingInvites ?? []).map((invite) => (
                <li
                  key={invite.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm text-text-primary">{invite.email}</p>
                    <p className="text-sm text-text-secondary capitalize">
                      {invite.role}
                    </p>
                  </div>
                  <form action={cancelInvite}>
                    <input type="hidden" name="id" value={invite.id} />
                    <button
                      type="submit"
                      className="text-sm text-text-secondary transition-colors hover:text-danger"
                    >
                      Cancel invite
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
