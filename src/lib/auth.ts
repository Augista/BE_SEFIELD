import jwt from "jsonwebtoken"
import { User } from "@/domain/entities/User";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"


export function generateToken(user: User): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "1h" })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
}


export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User
  } catch (err) {
    return null
  }
}
