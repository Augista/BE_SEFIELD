// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken, hashPassword } from "@/lib/auth";
import { User } from "@/domain/entities/User";
import { withCORS } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  return withCORS(res, req);
}

export async function POST(request: NextRequest) {
  const { name, email, password, phone } = await request.json();

  if (!email || !password) {
    const res = NextResponse.json(
      { error: "Email dan password wajib diisi" },
      { status: 400 }
    );
    return withCORS(res, request);
  }

  const { data: existingUser } = await db
    .from("user")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    const res = NextResponse.json(
      { error: "Email sudah digunakan" },
      { status: 409 }
    );
    return withCORS(res, request);
  }

  const hashedPassword = await hashPassword(password);

  const { data: newUser, error: createError } = await db
    .from("user")
    .insert([
      {
        email,
        password: hashedPassword,
        nama: name || "",
        phone: phone || "",
        role: "user",
      },
    ])
    .select("*")
    .single();

  if (createError || !newUser) {
    const res = NextResponse.json(
      { error: "Gagal membuat pengguna baru" },
      { status: 500 }
    );
    return withCORS(res, request);
  }

  const userPayload: User = {
    id: newUser.id,
    email: newUser.email,
    nama: newUser.nama,
    role: newUser.role,
    password: "",
  };

  const token = generateToken(userPayload);

  const res = NextResponse.json({
    message: "Registrasi berhasil",
    user: userPayload,
  });

  res.cookies.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1 jam
  });

  return withCORS(res, request);
}
