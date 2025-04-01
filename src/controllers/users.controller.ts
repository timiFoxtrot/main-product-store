import { UserService } from "../services/users.service";
import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.utilities";

export class UserController {
  constructor(private userService: UserService) {}

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.register(req.body);
      res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: result,
      });
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
      res
        .status(200)
        .json({ status: "success", message: "Login successful", data: result });
    } catch (error: any) {
      logger.error(`ERROR SIGNING IN USER:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message || "An error occurred during login",
      });
    }
  };

  getUsers = async (req: Request, res: Response) => {
    try {
      console.log("here")
      const result = await this.userService.getUsers();
      res
        .status(200)
        .json({
          status: "success",
          message: "Users fetched successfully",
          data: result,
        });
    } catch (error) {
      logger.error(`ERROR FETCHING USERS:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message || "An error occurred during login",
      });
    }
  };
}
