// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken, hashPassword } from "@/lib/auth";
import { User } from "@/domain/entities/User";

function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // atau ganti dengan 'http://localhost:3000' untuk lebih aman
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle preflight request (OPTIONS)
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}

// Handle POST
export async function POST(request: NextRequest) {
  const { name, email, password, phone } = await request.json();

  if (!email || !password) {
    return withCORS(
      NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 })
    );
  }

  const { data: existingUser } = await db
    .from("user")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return withCORS(
      NextResponse.json({ error: "Email sudah digunakan" }, { status: 409 })
    );
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
    return withCORS(
      NextResponse.json({ error: "Gagal membuat pengguna baru" }, { status: 500 })
    );
  }

  const userPayload: User = {
    id: newUser.id,
    email: newUser.email,
    nama: newUser.nama,
    role: newUser.role,
    password: "",
  };

  const token = generateToken(userPayload);

  const response = NextResponse.json({
    message: "Registrasi berhasil",
    user: userPayload,
  });

  response.cookies.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return withCORS(response);
}
