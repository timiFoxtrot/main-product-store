import { UserService } from "../services/users.service";
import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.utilities";

export class UserController {
  constructor(private userService: UserService) {}

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.register(req.body);
      res.status(201).json({ data: result });
    } catch (error) {
      logger.error(`ERROR REGISTERING USER:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message || "An error occurred during signup",
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(
        email.toLowerCase(),
        password
      );
      res.status(200).json({ data: result });
    } catch (error: any) {
      logger.error(`ERROR SIGNING IN USER:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message || "An error occurred during login",
      });
    }
  };
}
