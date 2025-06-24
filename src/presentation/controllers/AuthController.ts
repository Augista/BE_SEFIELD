import { AuthUsecase } from "@/application/usecases/AuthUsecase";
import { User } from "@/domain/entities/User";

export class AuthController {
  constructor(private usecase: AuthUsecase) {}

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return await this.usecase.login(email, password);
  }

  async register(data: Omit<User, "id">): Promise<User> {
    return await this.usecase.register(data);
  }
}
