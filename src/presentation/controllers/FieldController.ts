import { FieldUsecase } from "@/application/usecases/FieldUsecase";
import { Field } from "@/domain/entities/Field";

export class FieldController {
  constructor(private usecase: FieldUsecase) {}

  async index(): Promise<Field[]> {
    return await this.usecase.getAllField();
  }

  async show(id: string): Promise<Field | null> {
    return await this.usecase.getFieldById(id);
  }

  async store(data: Omit<Field, "id" | "created_at" | "updated_at">): Promise<Field> {
    return await this.usecase.createField(data);
  }

  async update(
    id: string,
    data: Partial<Omit<Field, "id" | "created_at" | "updated_at">>
  ): Promise<Field> {
    return await this.usecase.updateField(id, data);
  }

  async destroy(id: string): Promise<void> {
    return await this.usecase.deleteField(id);
  }

  async confirm(id: string): Promise<unknown> {
    return await this.usecase.confirmField(id);
  }

  async cancel(id: string, reason: string): Promise<unknown> {
    return await this.usecase.cancelField(id, reason);
  }

  async reschedule(id: string, date: Date, start: string, end: string): Promise<unknown> {
    return await this.usecase.rescheduleField(id, date, start, end);
  }

  async activate(id: string): Promise<Field> {
    return await this.usecase.activateField(id);
  }

  async deactivate(id: string): Promise<Field> {
    return await this.usecase.deactivateField(id);
  }
}
