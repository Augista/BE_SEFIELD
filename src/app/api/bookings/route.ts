import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withCORS } from "@/lib/cors";
import { verifyToken } from "@/lib/auth";

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  return withCORS(response, request)
}
// GET Handler
export async function GET(request: NextRequest) {
  try {
    const { data: bookings, error } = await db
      .from("booking")
      .select(`
        *,
        field:field_id(*),
        user:user_id(*)
      `)
      .order("booking_date", { ascending: false });

    const response = error
      ? NextResponse.json({ error: "Gagal mengambil data booking" }, { status: 500 })
      : NextResponse.json({ bookings });

    return withCORS(response, request);
  } catch (error) {
    console.error("[GET BOOKINGS]", error);
    const response = NextResponse.json({ error: "Gagal mengambil data booking" }, { status: 500 });
    return withCORS(response, request);
  }
}

// POST Handler
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return withCORS(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        req
      );
    }

    const body = await req.json();
    const {
      field_id,
      user_name,
      user_phone,
      booking_date,
      start_time,
      duration,
      virtual_account,
      price,
      payment_deadline,
      end_time,
    } = body;

    if (
      !field_id ||
      !user_name ||
      !user_phone ||
      !booking_date ||
      !start_time ||
      !virtual_account
    ) {
      return withCORS(
        NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 }),
        req
      );
    }

    const { data: insertedBooking, error: insertError } = await db
      .from("booking")
      .insert([
        {
          field_id,
          user_id: user.id,
          user_name,
          user_email: user.email,
          user_phone,
          booking_date: new Date(booking_date).toISOString(),
          start_time,
          end_time,
          total_price: price,
          status: "pending",
          payment_deadline: new Date(payment_deadline).toISOString(),
          notes: null,
          duration_hour: duration,
          virtual_account,
        },
      ])
      .select("*")
      .single();

    if (insertError) {
      console.error("[POST BOOKINGS]", insertError);
      return withCORS(
        NextResponse.json(
          { error: "Gagal membuat booking", details: insertError.message },
          { status: 500 }
        ),
        req
      );
    }

    return withCORS(
      NextResponse.json({ booking: insertedBooking }, { status: 201 }),
      req
    );
  } catch (error) {
    console.error("[POST BOOKINGS]", error);
    return withCORS(
      NextResponse.json({ error: "Gagal membuat booking" }, { status: 500 }),
      req
    );
  }
}

