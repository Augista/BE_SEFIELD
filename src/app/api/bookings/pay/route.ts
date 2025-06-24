import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  const { booking_id } = await req.json()
  const updated = await db.booking.update({
    where: { id: booking_id },
    data: { status: "confirmed", updated_at: new Date() },
  })
  return NextResponse.json(updated)
}