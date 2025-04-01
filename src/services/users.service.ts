import { IUser } from "../models/users.model";
import { UserRepository } from "../repositories/users.repository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(user: IUser): Promise<Partial<IUser>> {
    return this.userRepository.create(user);
  }

  async login(email: string, password: string) {
    return this.userRepository.login({ email, password });
  }

  async getUsers() {
    return this.userRepository.getUsers()
  }
}
