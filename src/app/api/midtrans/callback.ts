// import { NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"

// export async function POST(req: NextRequest) {
//   const body = await req.json()

//   const {
//     order_id,
//     transaction_status,
//     fraud_status,
//     gross_amount,
//     signature_key,
//   } = body


//   try {
//     if (transaction_status === "capture" || transaction_status === "settlement") {
//       await db
//         .from("booking")
//         .update({ status: "confirmed", paymentStatus: "paid" })
//         .eq("id", order_id)
//     } else if (transaction_status === "cancel" || transaction_status === "expire") {
//       await db
//         .from("booking")
//         .update({ status: "cancelled", paymentStatus: "failed" })
//         .eq("id", order_id)
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Callback error:", error)
//     return NextResponse.json({ error: "Failed to process callback" }, { status: 500 })
//   }
// }
