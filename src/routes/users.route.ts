import { Router } from "express";
import { UserRepository } from "../repositories/users.repository";
import { UserService } from "../services/users.service";
import { UserController } from "../controllers/users.controller";
import { createUserSchema } from "../common/validation";


export const userRouter = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.post("/register", createUserSchema, userController.createUser);
userRouter.post("/login", userController.login)