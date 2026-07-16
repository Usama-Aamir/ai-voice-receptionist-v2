import { DEMO_BUSINESS_ID } from "@/lib/demo";
import { bookAppointment } from "@/lib/booking";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_phone: z.string().min(1, "Customer phone is required"),
  service_name: z.string().min(1, "Service name is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = requestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { booked: false, reason: "Invalid request body." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const result = await bookAppointment(admin, DEMO_BUSINESS_ID, parseResult.data);

    if ("error" in result) {
      return NextResponse.json({
        booked: false,
        reason: result.error,
        available_services: result.available_services,
      });
    }

    return NextResponse.json({
      booked: true,
      customer_name: result.customer_name,
      service_name: result.service_name,
      date: result.date,
      time: result.time,
      duration_minutes: result.duration_minutes,
    });
  } catch (error) {
    console.error("Voice book-appointment error:", error);
    return NextResponse.json(
      { booked: false, reason: "Unable to book appointment right now." },
      { status: 500 }
    );
  }
}
