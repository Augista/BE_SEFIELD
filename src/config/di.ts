import { BookingRepository } from "@/infrastructure/db/repositories/BookingRepository"
import { BookingUsecase } from "@/application/usecases/BookingUsecase"
import { BookingController } from "@/presentation/controllers/BookingController"
import { FieldRepository } from "@/infrastructure/db/repositories/FieldRepository"
import { FieldUsecase } from "@/application/usecases/FieldUsecase"
import { FieldController } from "@/presentation/controllers/FieldController"

const bookingRepo = new BookingRepository()
const bookingUsecase = new BookingUsecase(bookingRepo)
export const bookingController = new BookingController(bookingUsecase)

const fieldRepo = new FieldRepository()
const fieldUsecase = new FieldUsecase(fieldRepo)
export const fieldController = new FieldController(fieldUsecase)