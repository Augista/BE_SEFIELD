import { db } from "@/lib/db"
import { Field } from "@/domain/entities/Field"
import { IFieldRepository } from "@/domain/interfaces/IFieldRepository"

export class FieldRepository implements IFieldRepository {
  async getAll(): Promise<Field[]> {
    const { data, error } = await db.from("field").select("*")
    if (error) throw error
    return data as Field[]
  }

  async getById(id: string): Promise<Field | null> {
    const { data, error } = await db.from("field").select("*").eq("id", id).single()
    if (error && error.code !== "PGRST116") throw error
    return data as Field | null
  }

  async create(data: Omit<Field, "id" | "created_at" | "updated_at">): Promise<Field> {
    const { data: created, error } = await db.from("field").insert(data).select().single()
    if (error) throw error
    return created as Field
  }

  async update(id: string, data: Partial<Omit<Field, "id" | "created_at" | "updated_at">>): Promise<Field> {
    const { data: updated, error } = await db
      .from("field")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return updated as Field
  }

  async delete(id: string): Promise<void> {
    const { error } = await db.from("field").delete().eq("id", id)
    if (error) throw error
  }

  async activate(id: string): Promise<Field> {
    const { data, error } = await db
      .from("field")
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return data as Field
  }

  async deactivate(id: string): Promise<Field> {
    const { data, error } = await db
      .from("field")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return data as Field
  }

 
}
