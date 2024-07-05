import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
const port = 3000;
dotenv.config();

// MONGO DB CONNECT
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/client/dist")));

// HOME ROUTE
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// SERVER ERROR
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// SERVER RUNNING
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
