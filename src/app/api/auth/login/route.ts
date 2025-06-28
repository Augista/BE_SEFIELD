import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateToken, verifyPassword } from "@/lib/auth"
import { User } from "@/domain/entities/User"
import { withCORS } from "@/lib/cors"

// Handler untuk preflight (OPTIONS)
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  return withCORS(response, request)
}

// Handler utama POST (login)
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return withCORS(
      NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 }),
      request
    )
  }

  const { data: users, error } = await db
    .from("user")
    .select("*")
    .eq("email", email)
    .limit(1)
    .single()

  if (error || !users) {
    return withCORS(
      NextResponse.json({ error: "Email tidak ditemukan" }, { status: 404 }),
      request
    )
  }

  const isValid = await verifyPassword(password, users.password)
  if (!isValid) {
    return withCORS(
      NextResponse.json({ error: "Password salah" }, { status: 401 }),
      request
    )
  }

  const userPayload: User = {
    id: users.id,
    email: users.email,
    nama: users.nama,
    role: users.role,
    password: "",
  }

  const token = generateToken(userPayload)

  const response = NextResponse.json({
    message: "Login berhasil",
    token, // <- kembalikan token juga kalau mau dipakai di FE
    user: userPayload,
  })

  response.cookies.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1 jam
  })

  return withCORS(response, request)
}
