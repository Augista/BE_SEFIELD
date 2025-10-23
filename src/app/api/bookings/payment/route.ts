import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { withCORS } from "@/lib/cors"

export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  return withCORS(response, req)
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value
    const user = token ? verifyToken(token) : null

    if (!user) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      return withCORS(response, req)
    }

    const { bookingId } = await req.json()

    const { data: booking, error } = await db
      .from("booking")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single()

    if (error || !booking) {
      const response = NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 })
      return withCORS(response, req)
    }

    // Instead of Midtrans, just return booking data or dummy payment info
    const response = NextResponse.json({
      message: "Payment service disabled (Midtrans not configured)",
      booking,
    })
    return withCORS(response, req)
  } catch (error) {
    console.error("[PAYMENT ERROR]", error)
    const response = NextResponse.json(
      { error: "Failed to process payment (service disabled)" },
      { status: 500 }
    )
    return withCORS(response, req)
  }
}
