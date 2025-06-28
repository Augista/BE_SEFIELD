import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken, verifyPassword } from "@/lib/auth";
import { User } from "@/domain/entities/User";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi" },
      { status: 400 }
    );
  }

  const { data: users, error } = await db
    .from("user")
    .select("*")
    .eq("email", email)
    .limit(1)
    .single(); 

  if (error || !users) {
    return NextResponse.json(
      { error: "Email tidak ditemukan" },
      { status: 404 }
    );
  }

  const isValid = await verifyPassword(password, users.password);
  if (!isValid) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  const userPayload: User = {
    id: users.id,
    email: users.email,
    nama: users.nama,
    role: users.role,
    password: "", 
  };

  const token = generateToken(userPayload);

  const response = NextResponse.json({
    message: "Login berhasil",
    user: userPayload,
  });

  response.cookies.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}
