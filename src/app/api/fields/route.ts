import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const { data: fields, error } = await db
    .from("field")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("[GET FIELDS]", error);
    return NextResponse.json({ error: "Gagal mengambil data field" }, { status: 500 });
  }

  return NextResponse.json(fields);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data: field, error } = await db
    .from("field")
    .insert([body])
    .select("*")
    .single();

  if (error) {
    console.error("[POST FIELD]", error);
    return NextResponse.json({ error: "Gagal menambahkan field" }, { status: 500 });
  }

  return NextResponse.json(field, { status: 201 });
}
