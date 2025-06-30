import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import midtransClient from "midtrans-client"

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value
    const user = token ? verifyToken(token) : null

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bookingId } = await req.json()

    // Ambil detail booking dari DB
    const { data: booking, error } = await db
      .from("booking")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 })
    }

    const { id: orderId, total_price: grossAmount, user_name, user_email } = booking

    // Init Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY as string,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    })

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: user_name,
        email: user_email,
      },
    }

    const transaction = await snap.createTransaction(parameter)
    const snapToken = transaction.token

    return NextResponse.json({ token: snapToken })
  } catch (error) {
    console.error("[MIDTRANS ERROR]", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
