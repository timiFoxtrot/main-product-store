import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { trim_all } from "./common/middlewares/trim";
// import { authenticate } from "./common/middlewares/auth";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(trim_all);
app.disable("x-powered-by");
// app.use(authenticate);

export default app;
