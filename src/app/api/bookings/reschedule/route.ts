import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { withCORS } from "@/lib/cors";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded?.id) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const body = await req.json();
  const { bookingId, newDate, newTime } = body;

  const { error } = await db
    .from("booking")
    .update({
      date: newDate,
      time: newTime,
      hasBeenRescheduled: true,
    })
    .eq("id", bookingId)
    .eq("user_id", decoded.id); // 🟢 Ganti ke decoded.id

  if (error) {
    return NextResponse.json({ error: "Gagal reschedule" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
