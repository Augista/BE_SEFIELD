import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      orderBy: { booking_date: "desc" },
      include: {
        field: true,
        user: true,
      },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("[GET BOOKINGS]", error)
    return NextResponse.json({ error: "Gagal mengambil data booking" }, { status: 500 })
  }
}

// POST: Buat booking baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
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
    } = body

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
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const durationMinutes = calculateDuration(start_time, end_time)

    const newBooking = await db.booking.create({
      data: {
        field_id,
        user_id,
        user_name,
        user_email,
        user_phone,
        booking_date: new Date(booking_date),
        start_time,
        end_time,
        total_price,
        status: "pending",
        payment_deadline: new Date(payment_deadline),
        notes: notes || null,
        duration_minutes: durationMinutes,
      },
    })

    return NextResponse.json({ booking: newBooking }, { status: 201 })
  } catch (error) {
    console.error("[POST BOOKINGS]", error)
    return NextResponse.json({ error: "Gagal membuat booking" }, { status: 500 })
  }
}

// Utility: Hitung durasi dalam menit dari waktu mulai dan akhir (format: "HH:mm:ss")
function calculateDuration(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}
