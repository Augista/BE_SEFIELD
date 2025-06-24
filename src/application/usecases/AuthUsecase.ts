import { IUserRepository } from "@/domain/interfaces/IUserRepository";
import { User } from "@/domain/entities/User";
import { verifyPassword, hashPassword, generateToken } from "@/lib/auth"; // Pastikan kamu punya fungsi ini

export class AuthUsecase {
  constructor(private userRepo: IUserRepository) {}

async login(email: string, password: string): Promise<{ token: string; user: User }> {
  const user = await this.userRepo.getByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await verifyPassword(password, user.password); 
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user); 
  return { token, user };
}


  async register(data: Omit<User, "id">): Promise<User> {
    const existingUser = await this.userRepo.getByEmail(data.email);
    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const hashed = await hashPassword(data.password);
    return await this.userRepo.create({ ...data, password: hashed });
  }
}
