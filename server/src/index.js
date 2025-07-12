import express from "express";
import { errorHandler } from "./utils/errorHandler.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import itemRoutes from "./routes/item.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dbConnection } from "./db/index.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

dbConnection();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/item", itemRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(errorHandler);
