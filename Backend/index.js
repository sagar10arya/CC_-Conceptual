// import dotenv from "dotenv";
import "dotenv/config";
import connectDB from "./src/db/index.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import userRouter from "./src/routes/user.routes.js";

dotenv.config({ path: "./env" });

const app = express();
const __dirname = path.resolve();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Serve frontend build files
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Routes
app.use("/api/v1/users", userRouter);
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
      app.on("error", (error) => {
        console.log("ERR: ", error);
        throw error;
      });
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!!!: ", err);
  });