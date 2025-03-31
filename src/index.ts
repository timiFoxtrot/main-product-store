import dotenv from "dotenv";
import { Request, Response } from "express";
import app from "./app";
import connect from "./common/config/database";
import { handleErrors } from "./common/middlewares/error";
import { userRouter } from "./routes/users.route";
import { productRouter } from "./routes/products.route";
import { categoryRouter } from "./routes/categories.route";

dotenv.config();

app.get("/health", (req: Request, res: Response): any => {
  return res.status(200).json({
    status: "status",
    message: "server is up and running",
    data: null,
  });
});

app.use("/auth", userRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);

app.use(handleErrors);

app.use((req, res, _next) => {
  res.status(404).json({
    status: "error",
    message: "resource not found",
    path: req.url,
    method: req.method,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connect();
  console.log(`Server running on port ${PORT}`);
});
