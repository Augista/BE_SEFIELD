import { IUserRepository } from "@/domain/interfaces/IUserRepository"
import { User } from "@/domain/entities/User"
import { db } from "@/lib/db"

export class UserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    const { data, error } = await db.from("user").select("*")
    if (error) throw error
    return data as User[]
  }

  async getById(id: string): Promise<User | null> {
    const { data, error } = await db.from("user").select("*").eq("id", id).single()
    if (error && error.code !== "PGRST116") throw error
    return data as User | null
  }

  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await db.from("user").select("*").eq("email", email).single()
    if (error && error.code !== "PGRST116") throw error
    return data as User | null
  }

  async create(data: Omit<User, "id">): Promise<User> {
    const { data: created, error } = await db.from("user").insert(data).select().single()
    if (error) throw error
    return created as User
  }

  async update(id: string, data: Partial<Omit<User, "id">>): Promise<User> {
    const { data: updated, error } = await db.from("user").update(data).eq("id", id).select().single()
    if (error) throw error
    return updated as User
  }

  async delete(id: string): Promise<void> {
    const { error } = await db.from("user").delete().eq("id", id)
    if (error) throw error
  }
}
