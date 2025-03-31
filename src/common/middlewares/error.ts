import { isCelebrateError } from "celebrate";
import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const handleErrors = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (isCelebrateError(err)) {
    const errorBody =
      err.details.get("body") ||
      err.details.get("query") ||
      err.details.get("params");

    const errors = errorBody?.details.reduce((acc: any, val) => {
      const key = val.path.join(".");
      const message = val.message.replace(/['"]+/g, "");
      acc[key] = { message };
      return acc;
    }, {});

    res
      .status(400)
      .json({ status: "error", message: "Validation Error", error: errors });
  } else if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "error",
        message: "File size is too large. Maximum allowed is 5 MB.",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        status: "error",
        message: "Unexpected file type.",
      });
    }

    return res.status(400).json({
      status: "error",
      message: `MULTER:: ${err.code}/${err.message}`,
    });
  } else {
    console.log("here", err)
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
