import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function GET() {
  try {
    const { data: bookings, error } = await db
      .from("booking")
      .select(`
        *,
        field:field_id(*),
        user:user_id(*)
      `)
      .order("booking_date", { ascending: false });

    if (error) {
      console.error("[GET BOOKINGS]", error);
      return NextResponse.json({ error: "Gagal mengambil data booking" }, { status: 500 });
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("[GET BOOKINGS]", error);
    return NextResponse.json({ error: "Gagal mengambil data booking" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      field_id,
      user_id,
      user_name,
      user_email,
      user_phone,
      booking_date,
      start_time,
      end_time,
      total_price,
      payment_deadline,
      notes,
    } = body;

    if (
      !field_id ||
      !user_id ||
      !user_name ||
      !user_email ||
      !user_phone ||
      !booking_date ||
      !start_time ||
      !end_time ||
      !total_price ||
      !payment_deadline
    ) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const durationMinutes = calculateDuration(start_time, end_time);

    const { data: insertedBooking, error: insertError } = await db
      .from("booking")
      .insert([
        {
          field_id,
          user_id,
          user_name,
          user_email,
          user_phone,
          booking_date: new Date(booking_date).toISOString(),
          start_time,
          end_time,
          total_price,
          status: "pending",
          payment_deadline: new Date(payment_deadline).toISOString(),
          notes: notes || null,
          duration_minutes: durationMinutes,
        },
      ])
      .select("*")
      .single();

    if (insertError) {
      console.error("[POST BOOKINGS]", insertError);
      return NextResponse.json({ error: "Gagal membuat booking" }, { status: 500 });
    }

    return NextResponse.json({ booking: insertedBooking }, { status: 201 });
  } catch (error) {
    console.error("[POST BOOKINGS]", error);
    return NextResponse.json({ error: "Gagal membuat booking" }, { status: 500 });
  }
}

function calculateDuration(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}
