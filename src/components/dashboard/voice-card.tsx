function formatPhone(raw: string | null): string | null {
  if (!raw) return null;

  const normalized = raw.replace(/[\s-]/g, "");
  if (!normalized.startsWith("+60")) return normalized || null;

  const body = normalized.slice(3);

  // Malaysian mobile: starts with 1, typically 9 or 10 digits after +60
  if (body.startsWith("1") && body.length >= 9) {
    return `+60 ${body.slice(0, 2)}-${body.slice(2, 5)} ${body.slice(5)}`;
  }

  // Malaysian landline: 7-8 digits after +60, area code is first digit
  if (body.length === 8) {
    return `+60 ${body[0]}-${body.slice(1, 5)} ${body.slice(5)}`;
  }

  return normalized;
}

export function VoiceCard({ phone }: { phone: string | null }) {
  const formatted = formatPhone(phone);

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <p className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
        Voice Receptionist
      </p>

      {formatted ? (
        <>
          <p className="mt-3 font-mono text-3xl font-medium text-text-primary">
            {formatted}
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Customers can call this number anytime to speak with your AI receptionist.
          </p>
        </>
      ) : (
        <>
          <p className="mt-3 font-mono text-3xl font-medium text-text-primary">
            Voice receptionist coming soon
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Add your business phone number in Settings to enable voice calls.
          </p>
        </>
      )}
    </div>
  );
}
