import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import authRoute from "./route/authRoute.js";
import userRoute from "./route/userRoute.js";
import categoryRoute from "./route/categoryRouter.js";

const app = express();
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json()); // ✅ This is mandatory for JSON body parsing

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);

app.use(errorHandlerMiddleware);

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("✅ Database Connected!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
  });
