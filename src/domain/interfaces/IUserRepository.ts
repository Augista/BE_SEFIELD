import { User } from "../entities/User";

export interface IUserRepository {
    getAll(): Promise<User[]>;
    getById(id: string): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
    create(data: Omit<User, "id">): Promise<User>;
    update(id: string, data: Partial<Omit<User, "id">>): Promise<User>;
    delete(id: string): Promise<void>;
}