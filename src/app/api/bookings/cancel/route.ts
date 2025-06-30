import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { withCORS } from "@/lib/cors"

export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  return withCORS(response, req)
}


export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "")

  if (!token) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return withCORS(response, req)
  }

  const decoded = verifyToken(token)
  if (!decoded?.id) {
    const response = NextResponse.json({ error: "Invalid token" }, { status: 403 })
    return withCORS(response, req)
  }

  const body = await req.json()
  const { bookingId } = body

  const { error } = await db
    .from("booking")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("user_id", decoded.id)

  if (error) {
    const response = NextResponse.json({ error: "Gagal membatalkan booking" }, { status: 500 })
    return withCORS(response, req)
  }

  const response = NextResponse.json({ success: true })
  return withCORS(response, req)
}
