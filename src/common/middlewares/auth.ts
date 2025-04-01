import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import User, { IUser, Roles } from "../../models/users.model";
import { UnauthorizedError } from "../errors/UnauthorizedError";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      token?: string | null;
    }
  }
}

interface Param {
  isAdmin?: boolean;
}

export const authenticate = (param: Param) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        status: "error",
        statusCode: 401,
        message: "Invalid authorization header",
      });
    }

    const [, token] = authorization.split(" ");

    try {
      if (!token) {
        return res.status(401).json({
          status: "error",
          statusCode: 401,
          message: "No token provided",
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as jwt.JwtPayload;

      const user: IUser | null = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ message: "Access denied" });

      if (param.isAdmin) {
        if (!user.roles.includes(Roles.ADMIN)) {
          return res.status(401).json({
            status: "error",
            statusCode: 401,
            message: "You are not authorized",
          });
        }
      }

      delete user.toObject().password;
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return res
          .status(401)
          .json({ status: "error", message: error.message });
      }

      if (error instanceof JsonWebTokenError) {
        return next(new UnauthorizedError("Invalid token"));
      }

      res
        .status(error.statusCode)
        .json({ status: "error", message: error.message });
    }
  };
};
