import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { trim_all } from "./common/middlewares/trim";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
app.use(express.json());
app.use(cors());
app.use(trim_all);
app.disable("x-powered-by");
// app.use(authenticate);

export default app;
