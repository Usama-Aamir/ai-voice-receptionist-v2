import { DEMO_BUSINESS_ID } from "@/lib/demo";
import { bookAppointment } from "@/lib/booking";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

function parseArguments(args: unknown): Record<string, unknown> {
  if (typeof args === "string") {
    try {
      return JSON.parse(args);
    } catch {
      return {};
    }
  }
  if (typeof args === "object" && args !== null) {
    return args as Record<string, unknown>;
  }
  return {};
}

function formatTimeTo12Hour(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

function formatDateFriendly(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const toolCalls = (body.message?.toolCalls || body.message?.toolCallList || []) as Array<{
      id: string;
      function: {
        name: string;
        arguments: unknown;
      };
    }>;

    if (!toolCalls || toolCalls.length === 0) {
      return NextResponse.json({
        results: [
          {
            toolCallId: "",
            result: "Invalid request: no tool calls provided.",
          },
        ],
      });
    }

    const toolCall = toolCalls[0];
    const toolCallId = toolCall.id;
    const args = parseArguments(toolCall.function.arguments);

    const customer_name = args.customer_name as string;
    const customer_phone = args.customer_phone as string;
    const service_name = args.service_name as string;
    const date = args.date as string;
    const time = args.time as string;

    if (!customer_name || !customer_phone || !service_name || !date || !time) {
      return NextResponse.json({
        results: [
          {
            toolCallId,
            result: "Missing required parameters: customer_name, customer_phone, service_name, date, and time are required.",
          },
        ],
      });
    }

    const admin = createAdminClient();
    const result = await bookAppointment(admin, DEMO_BUSINESS_ID, {
      customer_name,
      customer_phone,
      service_name,
      date,
      time,
    });

    let resultString: string;

    if ("error" in result) {
      const available = result.available_services?.join(", ") || "";
      resultString = available
        ? `Booking failed. Service not found. Available services are: ${available}.`
        : "Booking failed. Service not found. Please check the available services.";
    } else {
      resultString = `Booked successfully for ${result.customer_name} on ${formatDateFriendly(result.date)} at ${formatTimeTo12Hour(result.time)} for ${result.service_name}.`;
    }

    return NextResponse.json({
      results: [
        {
          toolCallId,
          result: resultString,
        },
      ],
    });
  } catch (error) {
    console.error("Voice book-appointment error:", error);
    return NextResponse.json({
      results: [
        {
          toolCallId: "",
          result: "Unable to book appointment right now. Please try again later.",
        },
      ],
    });
  }
}
