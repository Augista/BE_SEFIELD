import { db } from "@/lib/db"
import { IBookingRepository } from "@/domain/interfaces/IBookingRepository"
import { Booking } from "@/domain/entities/Booking"

export class BookingRepository implements IBookingRepository {
  async getAll(): Promise<Booking[]> {
    const { data, error } = await db
      .from("booking")
      .select("*, user: user_id (*), field: field_id (*)")

    if (error) throw error
    return data as Booking[]
  }

  async create(data: any): Promise<Booking> {
    const { data: created, error } = await db.from("booking").insert(data).select().single()
    if (error) throw error
    return created as Booking
  }

  async confirm(booking_id: string): Promise<Booking> {
    const { data, error } = await db
      .from("booking")
      .update({ status: "confirmed", updated_at: new Date().toISOString() })
      .eq("id", booking_id)
      .select()
      .single()
    if (error) throw error
    return data as Booking
  }

  async cancel(booking_id: string, reason: string): Promise<Booking> {
    const { data, error } = await db
      .from("booking")
      .update({
        status: "cancelled",
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking_id)
      .select()
      .single()
    if (error) throw error
    return data as Booking
  }

  async reschedule(booking_id: string, date: Date, start: string, end: string): Promise<Booking> {
    const { data: old, error: oldError } = await db
      .from("booking")
      .select("*")
      .eq("id", booking_id)
      .single()

    if (oldError) throw oldError

    const [startHour, startMinute] = start.split(":").map(Number)
    const [endHour, endMinute] = end.split(":").map(Number)
    const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute)

    const { data, error } = await db
      .from("booking")
      .update({
        booking_date: date.toISOString().split("T")[0],
        start_time: start,
        end_time: end,
        duration_minutes: duration,
        old_date: old.booking_date,
        old_start_time: old.start_time,
        old_end_time: old.end_time,
        rescheduled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking_id)
      .select()
      .single()

    if (error) throw error
    return data as Booking
  }
}
