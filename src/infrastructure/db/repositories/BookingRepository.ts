import { db } from "@/lib/db"
import { IBookingRepository } from "@/domain/interfaces/IBookingRepository"
import { Booking } from "@/domain/entities/Booking"

export class BookingRepository implements IBookingRepository {
  async getAll(): Promise<Booking[]> {
    return await db.booking.findMany({ include: { user: true, field: true } })
  }

  async create(data: any): Promise<Booking> {
    return await db.booking.create({ data })
  }

  async confirm(booking_id: string): Promise<Booking> {
    return await db.booking.update({
      where: { id: booking_id },
      data: { status: "confirmed", updated_at: new Date() },
    })
  }

  async cancel(booking_id: string, reason: string): Promise<Booking> {
    return await db.booking.update({
      where: { id: booking_id },
      data: {
        status: "cancelled",
        cancellation_reason: reason,
        cancelled_at: new Date(),
        updated_at: new Date(),
      },
    })
  }

  async reschedule(
    booking_id: string,
    date: Date,
    start: string,
    end: string
  ): Promise<Booking> {
     const old = await db.booking.findUnique({ where: { id: booking_id } })

  const [startHour, startMinute] = start.split(":").map(Number)
  const [endHour, endMinute] = end.split(":").map(Number)
  const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute)
  
  return await db.booking.update({
      where: { id: booking_id },
      data: {
        booking_date: date,
        start_time: start,
        end_time: end,
        duration_minutes: duration,
        old_date: old?.booking_date,
        old_start_time: old?.start_time,
        old_end_time: old?.end_time,
        rescheduled_at: new Date(),
        updated_at: new Date(),
      },
    })
  }
}