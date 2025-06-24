import { db } from "@/lib/db"; 
import { Field } from "@/domain/entities/Field";
import { IFieldRepository } from "@/domain/interfaces/IFieldRepository";

export class FieldRepository implements IFieldRepository {
  confirm(id: string): unknown {
    throw new Error("Method not implemented.");
  }
  cancel(id: string, reason: string): unknown {
    throw new Error("Method not implemented.");
  }
  reschedule(id: string, date: Date, start: string, end: string): unknown {
    throw new Error("Method not implemented.");
  }
  async getAll(): Promise<Field[]> {
    return await db.field.findMany();
  }

  async getById(id: string): Promise<Field | null> {
    return await db.field.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<Field, "id" | "created_at" | "updated_at">): Promise<Field> {
    return await db.field.create({
      data: {
        ...data,
      },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Field, "id" | "created_at" | "updated_at">>
  ): Promise<Field> {
    const existing = await db.field.findUnique({ where: { id } });
    if (!existing) throw new Error("Field not found");

    return await db.field.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await db.field.findUnique({ where: { id } });
    if (!existing) throw new Error("Field not found");

    await db.field.delete({ where: { id } });
  }

  async activate(id: string): Promise<Field> {
    const existing = await db.field.findUnique({ where: { id } });
    if (!existing) throw new Error("Field not found");

    return await db.field.update({
      where: { id },
      data: {
        is_active: true,
        updated_at: new Date(),
      },
    });
  }

  async deactivate(id: string): Promise<Field> {
    const existing = await db.field.findUnique({ where: { id } });
    if (!existing) throw new Error("Field not found");

    return await db.field.update({
      where: { id },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
    });
  }
}
