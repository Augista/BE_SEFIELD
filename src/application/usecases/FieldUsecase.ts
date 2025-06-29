import { IFieldRepository } from "@/domain/interfaces/IFieldRepository";
import { Field } from "@/domain/entities/Field";

export class FieldUsecase {
  constructor(private fieldRepo: IFieldRepository) {}

  // Ambil semua field aktif/tidak aktif
  getAllFields(): Promise<Field[]> {
    return this.fieldRepo.getAll();
  }

  // Ambil field berdasarkan ID
  getFieldById(id: string): Promise<Field | null> {
    return this.fieldRepo.getById(id);
  }

  // Tambah field baru
  createField(data: Omit<Field, "id" | "created_at" | "updated_at">): Promise<Field> {
    return this.fieldRepo.create(data);
  }

  // Update sebagian data field berdasarkan ID
  updateField(
    id: string,
    data: Partial<Omit<Field, "id" | "created_at" | "updated_at">>
  ): Promise<Field> {
    return this.fieldRepo.update(id, data);
  }

  // Soft delete atau penghapusan lapangan
  deleteField(id: string): Promise<void> {
    return this.fieldRepo.delete(id);
  }

  // Aktifkan field (set is_active = true)
  activateField(id: string): Promise<Field> {
    return this.fieldRepo.activate(id);
  }

  // Nonaktifkan field (set is_active = false)
  deactivateField(id: string): Promise<Field> {
    return this.fieldRepo.deactivate(id);
  }
}
