import { IUserRepository } from "@/domain/interfaces/IUserRepository"
import { User } from "@/domain/entities/User"
import { db } from "@/lib/db"

export class UserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    return await db.user.findMany()
  }

  async getById(id: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { id },
    })
  }

  async getByEmail(email: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { email },
    })
  }

  async create(data: Omit<User, "id">): Promise<User> {
    return await db.user.create({
      data,
    })
  }

  async update(id: string, data: Partial<Omit<User, "id">>): Promise<User> {
    return await db.user.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await db.user.delete({
      where: { id },
    })
  }
}
