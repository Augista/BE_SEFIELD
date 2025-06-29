
import { NextRequest, NextResponse } from "next/server"
import { withCORS } from "@/lib/cors"

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ message: "Logged out" })
  response.cookies.set("authToken", "", {
    path: "/",
    maxAge: 0,
  })

  return withCORS(response, request)
}
