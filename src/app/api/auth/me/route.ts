import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const token = (await cookies()).get("token")?.value
  const user = token ? verifyToken(token) : null
  return user
    ? NextResponse.json({ user })
    : NextResponse.json({ user: null }, { status: 401 })
}