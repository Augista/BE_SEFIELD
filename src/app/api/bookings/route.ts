import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withCORS } from "@/lib/cors";
import { verifyToken } from "@/lib/auth";

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return withCORS(response, request);
}
// GET Handler
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return withCORS(
        NextResponse.json({ error: "Tidak ada token" }, { status: 401 }),
        request
      )
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = verifyToken(token)

    if (!decoded || !decoded.id) {
      return withCORS(
        NextResponse.json({ error: "Token tidak valid" }, { status: 403 }),
        request
      )
    }

    const userId = decoded.id

    const { data: bookings, error } = await db
      .from("booking")
      .select(`
        *,
        field:field_id(*),
        user:user_id(*)
      `)
      .eq("user_id", userId)
      .order("booking_date", { ascending: false })

    if (error) {
      return withCORS(
        NextResponse.json({ error: "Gagal mengambil data booking" }, { status: 500 }),
        request
      )
    }

    return withCORS(NextResponse.json({ bookings }), request)
  } catch (error) {
    console.error("[GET BOOKINGS]", error)
    return withCORS(
      NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 }),
      request
    )
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
      duration_hour,
      virtual_account,
      total_price,
      payment_deadline,
      end_time,
    } = body;

    // Validasi field wajib
    if (
      !field_id ||
      !user_name ||
      !user_phone ||
      !booking_date ||
      !start_time ||
      !virtual_account ||
      typeof total_price !== "number"
    ) {
      return withCORS(
        NextResponse.json({ error: "Data tidak lengkap atau tidak valid" }, { status: 400 }),
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
          total_price,
          status: "pending",
          payment_deadline: new Date(payment_deadline).toISOString(),
          notes: null,
          duration_hour,
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
// PATCH Handler
export async function PATCH(req: NextRequest) {
  try {
    const token =
      req.cookies.get("authToken")?.value ||
      req.headers.get("Authorization")?.replace("Bearer ", "");

    const user = token ? verifyToken(token) : null;
    if (!user) {
      return withCORS(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        req
      );
    }

    const { bookingId, updates } = await req.json();

    const { data, error } = await db
      .from("booking")
      .update(updates)
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) {
      console.error("[PATCH BOOKINGS]", error);
      return withCORS(
        NextResponse.json({ error: "Gagal memperbarui booking" }, { status: 500 }),
        req
      );
    }

    return withCORS(NextResponse.json({ booking: data }), req);
  } catch (error) {
    console.error("[PATCH BOOKINGS]", error);
    return withCORS(
      NextResponse.json({ error: "Gagal memperbarui booking" }, { status: 500 }),
      req
    );
  }
}
