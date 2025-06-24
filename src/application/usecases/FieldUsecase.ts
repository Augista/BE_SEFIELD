import { IFieldRepository } from "@/domain/interfaces/IFieldRepository";
import { Field } from "@/domain/entities/Field";

export class FieldUsecase {
  constructor(private fieldRepo: IFieldRepository) {}

  getAllField(): Promise<Field[]> {
    return this.fieldRepo.getAll();
  }

  getFieldById(id: string): Promise<Field | null> {
    return this.fieldRepo.getById(id);
  }

  createField(data: Omit<Field, "id" | "created_at" | "updated_at">): Promise<Field> {
    return this.fieldRepo.create(data);
  }

  updateField(
    id: string,
    data: Partial<Omit<Field, "id" | "created_at" | "updated_at">>
  ): Promise<Field> {
    return this.fieldRepo.update(id, data);
  }

  deleteField(id: string): Promise<void> {
    return this.fieldRepo.delete(id);
  }

  confirmField(id: string): unknown {
    return this.fieldRepo.confirm(id);
  }

  cancelField(id: string, reason: string): unknown {
    return this.fieldRepo.cancel(id, reason);
  }

  rescheduleField(id: string, date: Date, start: string, end: string): unknown {
    return this.fieldRepo.reschedule(id, date, start, end);
  }

  activateField(id: string): Promise<Field> {
    return this.fieldRepo.activate(id);
  }

  deactivateField(id: string): Promise<Field> {
    return this.fieldRepo.deactivate(id);
  }
}
