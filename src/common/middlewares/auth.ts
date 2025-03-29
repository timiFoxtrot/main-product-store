import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../models/users.model';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      token?: string | null;
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const publicEndpoints = ['/health', '/users/login', '/users/register', '/products/all'];
    if (publicEndpoints.includes(req.path)) {
      return next();
    }
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'Invalid authorization header' });
    }

    const token = authorizationHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'Authorization token not found' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Access denied' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
