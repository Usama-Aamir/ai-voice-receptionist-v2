import { DEMO_BUSINESS_ID } from "@/lib/demo";
import { checkAvailability } from "@/lib/booking";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  service_name: z.string().min(1, "Service name is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = requestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { available: false, reason: "Invalid request body." },
        { status: 400 }
      );
    }

    const { date, service_name } = parseResult.data;
    const admin = createAdminClient();
    const result = await checkAvailability(admin, DEMO_BUSINESS_ID, {
      date,
      service_name,
    });

    if ("error" in result) {
      return NextResponse.json({
        available: false,
        reason: result.error,
        available_services: result.available_services,
      });
    }

    if ("closed" in result) {
      return NextResponse.json({
        available: false,
        reason: result.message,
      });
    }

    if (result.slots.length === 0) {
      return NextResponse.json({
        available: false,
        reason: "No open time slots for that date.",
        day_of_week: result.day_of_week,
      });
    }

    // Format slots for voice (e.g. "09:00" -> "9:00 AM")
    const formattedSlots = result.slots.map((slot) => {
      const [hours, minutes] = slot.split(":").map(Number);
      const suffix = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 === 0 ? 12 : hours % 12;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
    });

    return NextResponse.json({
      available: true,
      slots: formattedSlots,
      day_of_week: result.day_of_week,
    });
  } catch (error) {
    console.error("Voice check-availability error:", error);
    return NextResponse.json(
      { available: false, reason: "Unable to check availability right now." },
      { status: 500 }
    );
  }
}
