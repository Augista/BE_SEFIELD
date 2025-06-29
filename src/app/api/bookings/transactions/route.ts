
import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, grossAmount, customerName, customerEmail } = body;

    const snap = new midtransClient.Snap({
      isProduction: false, 
      serverKey: process.env.MIDTRANS_SERVER_KEY as string,
      clientKey: process.env.MIDTRANS_CLIENT_KEY, 
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customerName,
        email: customerEmail,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    return NextResponse.json({ token: snapToken });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
