import multer, { FileFilterCallback, MulterError } from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb: FileFilterCallback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(
        new MulterError("LIMIT_UNEXPECTED_FILE") as any,
        false
      );
    }
  },
});
