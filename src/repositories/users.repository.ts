import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/users.model";
import { ConflictError } from "../common/errors/ConflictError";
import { BadRequestError } from "../common/errors/BadRequestError";

export class UserRepository {
  async create(user: IUser): Promise<Partial<IUser>> {
    const existingUser = await User.findOne({
      email: user.email.toLowerCase(),
    });
    if (existingUser) throw new ConflictError("Email already taken");
    const newUser = new User({ ...user, email: user.email.toLowerCase() });
    const savedUser = await newUser.save();

    const userObj = savedUser.toObject();
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword 
  }

  async login(data: { email: string; password: string }) {
    const user = await User.findOne({ email: data.email });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new BadRequestError("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    return token;
  }
}
