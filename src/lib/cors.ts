import { NextRequest, NextResponse } from "next/server"

export function withCORS(response: NextResponse, request?: NextRequest) {
  const origin = request?.headers.get("origin")

  const allowedOrigins = [
    "http://localhost:3000",
    "https://se-field.vercel.app",
  ]

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
  }

  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type")
  response.headers.set("Access-Control-Allow-Credentials", "true")
  return response
}