import {
  addClosure,
  deleteClosure,
  saveBusinessHours,
} from "@/app/actions/business-hours";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const dayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type BusinessHour = {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
};

type BusinessClosure = {
  id: string;
  closure_date: string;
  reason: string | null;
};

export default async function BusinessHoursPage() {
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

  const { data: hours } = await supabase
    .from("business_hours")
    .select("day_of_week, open_time, close_time, is_closed")
    .eq("business_id", businessId)
    .order("day_of_week", { ascending: true });

  const { data: closures } = await supabase
    .from("business_closures")
    .select("id, closure_date, reason")
    .eq("business_id", businessId)
    .gte("closure_date", new Date().toISOString().split("T")[0])
    .order("closure_date", { ascending: true });

  const hoursByDay = new Map<number, BusinessHour>();
  for (const hour of hours ?? []) {
    hoursByDay.set(hour.day_of_week, hour);
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight text-text-primary">
          Business hours
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Set your weekly operating hours.
        </p>
      </div>

      <form
        action={saveBusinessHours}
        className="rounded-lg border border-border bg-surface p-6"
      >
        <div className="space-y-5">
          {dayLabels.map((label, day) => {
            const hour = hoursByDay.get(day) ?? {
              day_of_week: day,
              open_time: "09:00",
              close_time: "17:00",
              is_closed: false,
            };

            return (
              <div
                key={day}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="w-32 text-sm font-medium text-text-primary">
                  {label}
                </div>

                <div className="flex flex-1 items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input
                      type="checkbox"
                      name={`is_closed_${day}`}
                      defaultChecked={hour.is_closed}
                      className="h-4 w-4 rounded border-border bg-bg text-accent focus:ring-0"
                    />
                    Closed
                  </label>

                  <input
                    type="time"
                    name={`open_time_${day}`}
                    defaultValue={hour.open_time ?? "09:00"}
                    className="flex-1 rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                  />

                  <span className="text-sm text-text-secondary">to</span>

                  <input
                    type="time"
                    name={`close_time_${day}`}
                    defaultValue={hour.close_time ?? "17:00"}
                    className="flex-1 rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
          >
            Save hours
          </button>
        </div>
      </form>

      <div className="mt-8 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium tracking-tight text-text-primary">
          Holidays / Closed dates
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Mark days your business will be closed for the rest of the year.
        </p>

        <form action={addClosure} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            type="date"
            name="closure_date"
            required
            className="rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
          />
          <input
            type="text"
            name="reason"
            placeholder="Optional reason (e.g. Public holiday)"
            className="rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary"
          >
            Add closed date
          </button>
        </form>

        <div className="mt-6">
          {(closures ?? []).length === 0 ? (
            <p className="text-sm text-text-secondary">
              No upcoming closed dates.
            </p>
          ) : (
            <ul className="divide-y divide-border border-t border-border">
              {(closures ?? []).map((closure: BusinessClosure) => (
                <li
                  key={closure.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-mono text-sm text-text-primary">
                      {closure.closure_date}
                    </p>
                    {closure.reason && (
                      <p className="text-sm text-text-secondary">
                        {closure.reason}
                      </p>
                    )}
                  </div>
                  <form action={deleteClosure}>
                    <input type="hidden" name="id" value={closure.id} />
                    <button
                      type="submit"
                      className="text-sm text-text-secondary transition-colors hover:text-danger"
                    >
                      Remove
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
