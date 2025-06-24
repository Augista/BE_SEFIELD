import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  const { booking_id, new_date, new_start_time, new_end_time } = await req.json()
  const booking = await db.booking.findUnique({ where: { id: booking_id } })
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const duration = calculateDuration(new_start_time, new_end_time)
  const updated = await db.booking.update({
    where: { id: booking_id },
    data: {
      booking_date: new Date(new_date),
      start_time: new_start_time,
      end_time: new_end_time,
      duration_minutes: duration,
      old_date: booking.booking_date,
      old_start_time: booking.start_time,
      old_end_time: booking.end_time,
      rescheduled_at: new Date(),
      updated_at: new Date(),
    },
  })
  return NextResponse.json(updated)
}

function calculateDuration(new_start_time: any, new_end_time: any) {
  throw new Error("Function not implemented.")
}
