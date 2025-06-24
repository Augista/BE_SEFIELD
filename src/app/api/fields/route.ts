import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const fields = await db.field.findMany({ where: { is_active: true } })
  return NextResponse.json(fields)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const field = await db.field.create({ data: body })
  return NextResponse.json(field, { status: 201 })
}


