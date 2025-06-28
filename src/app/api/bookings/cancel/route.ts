import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"


export async function POST(req: NextRequest) {
  const { booking_id, reason } = await req.json()
  const updated = await db.from("booking").update({
    where: { id: booking_id },
    data: {
      status: "cancelled",
      cancellation_reason: reason,
      cancelled_at: new Date(),
      updated_at: new Date()
    }
  })
  return NextResponse.json(updated)
}