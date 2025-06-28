import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Supabase client
import { generateToken, hashPassword } from "@/lib/auth";
import { User } from "@/domain/entities/User";

export async function POST(request: NextRequest) {
  const { name, email, password, phone } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi" },
      { status: 400 }
    );
  }

  // Check if user already exists
  const { data: existingUser, error: existingError } = await db
    .from("user")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return NextResponse.json(
      { error: "Email sudah digunakan" },
      { status: 409 }
    );
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the new user
  const { data: newUser, error: createError } = await db
    .from("user")
    .insert([
      {
        email,
        password: hashedPassword,
        nama: name || "",
        phone: phone || "",
        role: "user", // Default role
      },
    ])
    .select("*")
    .single();

  if (createError || !newUser) {
    return NextResponse.json(
      { error: "Gagal membuat pengguna baru" },
      { status: 500 }
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
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}
