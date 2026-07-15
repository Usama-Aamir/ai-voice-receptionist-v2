"use client";

import {
  addClosure,
  deleteClosure,
  saveBusinessHours,
} from "@/app/actions/business-hours";
import { useFormState, useFormStatus } from "react-dom";

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

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90 disabled:opacity-50"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function FormMessage({ state }: { state?: { message: string; error: boolean } }) {
  if (!state?.message) return null;
  return (
    <p className={`mt-4 text-sm ${state.error ? "text-danger" : "text-text-secondary"}`}>
      {state.message}
    </p>
  );
}

export function BusinessHoursForm({
  hours,
}: {
  hours: BusinessHour[];
}) {
  const [state, formAction] = useFormState(saveBusinessHours, {
    error: false,
    message: "",
  });

  const hoursByDay = new Map<number, BusinessHour>();
  for (const hour of hours) {
    hoursByDay.set(hour.day_of_week, hour);
  }

  return (
    <form
      action={formAction}
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

      <FormMessage state={state} />

      <div className="mt-8 flex justify-end">
        <SubmitButton label="Save hours" />
      </div>
    </form>
  );
}

function AddClosureButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary disabled:opacity-50"
    >
      {pending ? "Adding..." : "Add closed date"}
    </button>
  );
}

function DeleteClosureButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm text-text-secondary transition-colors hover:text-danger disabled:opacity-50"
    >
      {pending ? "Removing..." : "Remove"}
    </button>
  );
}

export function ClosuresSection({
  closures,
}: {
  closures: BusinessClosure[];
}) {
  const [addState, addAction] = useFormState(addClosure, {
    error: false,
    message: "",
  });

  return (
    <div className="mt-8 rounded-lg border border-border bg-surface p-6">
      <h2 className="text-lg font-medium tracking-tight text-text-primary">
        Holidays / Closed dates
      </h2>
      <p className="mt-2 text-sm text-text-secondary">
        Mark days your business will be closed for the rest of the year.
      </p>

      <form action={addAction} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        <AddClosureButton />
      </form>

      <FormMessage state={addState} />

      <div className="mt-6">
        {closures.length === 0 ? (
          <p className="text-sm text-text-secondary">No upcoming closed dates.</p>
        ) : (
          <ul className="divide-y divide-border border-t border-border">
            {closures.map((closure) => (
              <ClosureItem key={closure.id} closure={closure} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ClosureItem({ closure }: { closure: BusinessClosure }) {
  const [deleteState, deleteAction] = useFormState(deleteClosure, {
    error: false,
    message: "",
  });

  return (
    <li className="flex items-center justify-between py-3">
      <div>
        <p className="font-mono text-sm text-text-primary">
          {closure.closure_date}
        </p>
        {closure.reason && (
          <p className="text-sm text-text-secondary">{closure.reason}</p>
        )}
      </div>
      <form action={deleteAction} className="flex flex-col items-end">
        <input type="hidden" name="id" value={closure.id} />
        <DeleteClosureButton />
        <FormMessage state={deleteState} />
      </form>
    </li>
  );
}
