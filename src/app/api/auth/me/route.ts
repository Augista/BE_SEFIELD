import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { withCORS } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return withCORS(new NextResponse(null, { status: 204 }), request)
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("authToken")?.value
    // console.log("TOKEN:", request.cookies.get("authToken")?.value)


    if (!token) {
      return withCORS(NextResponse.json({ user: null }, { status: 401 }), request)
    }

    const user = verifyToken(token)

    if (!user) {
      return withCORS(NextResponse.json({ user: null }, { status: 401 }), request)
    }

    return withCORS(NextResponse.json({ user }), request)
  } catch (err) {
    console.error("Token verification failed:", err)
    return withCORS(NextResponse.json({ user: null }, { status: 401 }), request)
  }
}
