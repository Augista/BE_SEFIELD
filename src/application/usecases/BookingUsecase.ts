import { IBookingRepository } from "@/domain/interfaces/IBookingRepository"

export class BookingUsecase {
  constructor(private bookingRepo: IBookingRepository) {}

  getAllBookings() {
    return this.bookingRepo.getAll()
  }

  createBooking(data: any) {
    return this.bookingRepo.create(data)
  }

  confirmBooking(id: string) {
    return this.bookingRepo.confirm(id)
  }

  cancelBooking(id: string, reason: string) {
    return this.bookingRepo.cancel(id, reason)
  }

  rescheduleBooking(id: string, date: Date, start: string, end: string) {
    return this.bookingRepo.reschedule(id, date, start, end)
  }
}
