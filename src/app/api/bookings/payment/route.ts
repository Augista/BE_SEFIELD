import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { withCORS } from "@/lib/cors"
import midtransClient from "midtrans-client"

export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  return withCORS(response, req)
}


export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value
    const user = token ? verifyToken(token) : null

    if (!user) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      return withCORS(response, req)
    }

    const { bookingId } = await req.json()

    const { data: booking, error } = await db
      .from("booking")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single()

    if (error || !booking) {
      const response = NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 })
      return withCORS(response, req)
    }

    const { id: orderId, total_price: grossAmount, user_name, user_email } = booking

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

    const response = NextResponse.json({ token: snapToken })
    return withCORS(response, req)
  } catch (error) {
    console.error("[MIDTRANS ERROR]", error)
    const response = NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
    return withCORS(response, req)
  }
}
