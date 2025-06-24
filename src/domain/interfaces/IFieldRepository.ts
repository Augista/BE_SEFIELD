import { Field } from "../entities/Field";

export interface IFieldRepository {
  confirm(id: string): unknown;
  cancel(id: string, reason: string): unknown;
  reschedule(id: string, date: Date, start: string, end: string): unknown;
  getAll(): Promise<Field[]>;
  getById(id: string): Promise<Field | null>;
  create(data: Omit<Field, "id" | "created_at" | "updated_at">): Promise<Field>;
  update(id: string, data: Partial<Omit<Field, "id" | "created_at" | "updated_at">>): Promise<Field>;
  delete(id: string): Promise<void>;
  activate(id: string): Promise<Field>;
  deactivate(id: string): Promise<Field>;
}
