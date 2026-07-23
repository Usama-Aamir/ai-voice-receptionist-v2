import { DEMO_BUSINESS_ID } from "@/lib/demo";
import { checkAvailability } from "@/lib/booking";
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

    const date = args.date as string;
    const service_name = args.service_name as string;

    if (!date || !service_name) {
      return NextResponse.json({
        results: [
          {
            toolCallId,
            result: "Missing required parameters: date and service_name are required.",
          },
        ],
      });
    }

    const admin = createAdminClient();
    const result = await checkAvailability(admin, DEMO_BUSINESS_ID, {
      date,
      service_name,
    });

    let resultString: string;

    if ("error" in result) {
      const available = result.available_services?.join(", ") || "";
      resultString = available
        ? `Service not found. Available services are: ${available}.`
        : "Service not found. Please check the available services.";
    } else if ("closed" in result) {
      resultString = result.message;
    } else if (result.slots.length === 0) {
      resultString = `No available slots on ${formatDateFriendly(date)}.`;
    } else {
      const formattedSlots = result.slots.map(formatTimeTo12Hour).join(", ");
      resultString = `Available slots on ${formatDateFriendly(date)} are ${formattedSlots}.`;
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
    console.error("Voice check-availability error:", error);
    return NextResponse.json({
      results: [
        {
          toolCallId: "",
          result: "Unable to check availability right now. Please try again later.",
        },
      ],
    });
  }
}
