import { BookingUsecase } from "@/application/usecases/BookingUsecase"

export class BookingController {
  constructor(private usecase: BookingUsecase) {}

  async index() {
    return await this.usecase.getAllBookings()
  }

  async store(data: any) {
    return await this.usecase.createBooking(data)
  }

  async confirm(id: string) {
    return await this.usecase.confirmBooking(id)
  }

  async cancel(id: string, reason: string) {
    return await this.usecase.cancelBooking(id, reason)
  }

  async reschedule(id: string, date: Date, start: string, end: string) {
    return await this.usecase.rescheduleBooking(id, date, start, end)
  }
}