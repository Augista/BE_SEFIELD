import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withCORS } from "@/lib/cors"

export async function GET() {
  try {
    const today = new Date()
    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(today.getDate() - 6) // untuk 7 hari total termasuk hari ini
    oneWeekAgo.setHours(0, 0, 0, 0)

    // Pemasukan hari ini
    const { data: todayIncomeData, error: todayIncomeErr } = await db
      .from("booking")
      .select("total_price")
      .gte("booking_date", startOfDay.toISOString())
      .lte("booking_date", endOfDay.toISOString())
      .eq("status", "paid")

    const todayIncome = todayIncomeData?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0

    // Pemasukan per hari selama seminggu
    const { data: weekData, error: weekErr } = await db
      .from("booking")
      .select("booking_date, total_price")
      .gte("booking_date", oneWeekAgo.toISOString())
      .lte("booking_date", endOfDay.toISOString())
      .eq("status", "paid")

    const weeklyMap: Record<string, number> = {}
    for (let i = 0; i < 7; i++) {
      const d = new Date(oneWeekAgo)
      d.setDate(d.getDate() + i)
      const key = d.toISOString().split("T")[0]
      weeklyMap[key] = 0
    }

    weekData?.forEach(({ booking_date, total_price }) => {
      const key = booking_date
      if (weeklyMap[key] != null) {
        weeklyMap[key] += Number(total_price)
      }
    })

    const weeklyIncome = Object.entries(weeklyMap).map(([date, total]) => ({ date, total }))

    // Total user yg booking hari ini
    const { data: userToday, error: userErr } = await db
      .from("booking")
      .select("user_id")
      .gte("booking_date", startOfDay.toISOString())
      .lte("booking_date", endOfDay.toISOString())
      .eq("status", "paid")

    const totalUsers = new Set(userToday?.map(b => b.user_id)).size

    // Jam terisi per lapangan
    const { data: jamData, error: jamErr } = await db
      .from("booking")
      .select("field_id, start_time, end_time")
      .gte("booking_date", startOfDay.toISOString())
      .lte("booking_date", endOfDay.toISOString())
      .eq("status", "paid")

    const { data: fields } = await db.from("field").select("id, name")

    const occupiedTimes = fields?.map(field => {
      const times = jamData
        ?.filter(b => b.field_id === field.id)
        .map(b => ({ start: b.start_time, end: b.end_time }))
      return {
        field: field.name,
        bookings: times || []
      }
    }) || []

    // Data user hari ini
    const { data: bookingDetail } = await db
      .from("booking")
      .select("user_name, total_price, start_time, end_time, field_id")
      .gte("booking_date", startOfDay.toISOString())
      .lte("booking_date", endOfDay.toISOString())
      .eq("status", "paid")

    const bookingWithField = bookingDetail?.map(b => {
      const field = fields?.find(f => f.id === b.field_id)
      return {
        user_name: b.user_name,
        field_name: field?.name || "-",
        time: `${b.start_time} - ${b.end_time}`,
        amount: b.total_price
      }
    }) || []

    return withCORS(NextResponse.json({
      todayIncome,
      weeklyIncome,
      totalUsers,
      occupiedTimes,
      todayBookings: bookingWithField
    }))
  } catch (err) {
    console.error("[SUMMARY ERROR]", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
