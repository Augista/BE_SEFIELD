import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Supabase client

export async function POST(req: NextRequest) {
  const { booking_id, new_date, new_start_time, new_end_time } = await req.json();

  // Fetch booking by ID
  const { data: booking, error: findError } = await db
    .from("booking")
    .select("*")
    .eq("id", booking_id)
    .single();

  if (findError || !booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const duration = calculateDuration(new_start_time, new_end_time);

  const { data: updated, error: updateError } = await db
    .from("booking")
    .update({
      booking_date: new Date(new_date).toISOString(),
      start_time: new_start_time,
      end_time: new_end_time,
      duration_minutes: duration,
      old_date: booking.booking_date,
      old_start_time: booking.start_time,
      old_end_time: booking.end_time,
      rescheduled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", booking_id)
    .select("*")
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }

  return NextResponse.json(updated);
}

// Assumes time is in "HH:mm" format
function calculateDuration(start: string, end: string): number {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const startDate = new Date(0, 0, 0, startHour, startMinute);
  const endDate = new Date(0, 0, 0, endHour, endMinute);

  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.floor(diffMs / (1000 * 60)); // minutes
}
