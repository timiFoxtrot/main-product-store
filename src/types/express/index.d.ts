import { MulterFile } from "../multer";

declare global {
  namespace Express {
    interface Request {
      files?: MulterFile[];
    }
  }
}

export {};
