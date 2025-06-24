
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
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

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email sudah digunakan" },
      { status: 409 }
    );
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || "",
      phone: phone || "",
    },
  });

  const userPayload: User = {
    id: newUser.id,
    email: newUser.email,
    nama: "",
    role: "",
    password: ""
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
    maxAge: 60 * 60, // 1 jam
  });

  return response;
}
