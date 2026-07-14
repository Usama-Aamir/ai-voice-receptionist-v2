import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendAppointmentConfirmation(params: {
  to: string;
  businessName: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  durationMinutes: number;
}) {
  const resend = getResend();
  if (!resend) {
    console.error("RESEND_API_KEY is not set");
    return { sent: false, error: "RESEND_API_KEY is not set" };
  }

  const { to, businessName, customerName, serviceName, date, time, durationMinutes } =
    params;

  const from =
    process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const subject = `Appointment confirmation — ${businessName}`;
  const text = `Hi ${customerName},\n\nYour appointment with ${businessName} is confirmed:\n\nService: ${serviceName}\nDate: ${date}\nTime: ${time}\nDuration: ${durationMinutes} minutes\n\nSee you then!`;

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      text,
    });

    return { sent: true, result };
  } catch (error) {
    console.error("Failed to send appointment confirmation email:", error);
    return { sent: false, error };
  }
}
