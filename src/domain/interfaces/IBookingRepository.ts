import { Booking } from "../entities/Booking"

export interface IBookingRepository {
  getAll(): Promise<Booking[]>
  create(data: Partial<Booking>): Promise<Booking>
  confirm(booking_id: string): Promise<Booking>
  cancel(booking_id: string, reason: string): Promise<Booking>
  reschedule(
    booking_id: string,
    date: Date,
    start: string,
    end: string
  ): Promise<Booking>
}