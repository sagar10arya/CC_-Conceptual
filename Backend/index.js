import "dotenv/config";
import connectDB from "./src/db/index.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import userRouter from "./src/routes/user.routes.js";

const app = express();

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (_, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   // res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
// });
const path = require("path");

// Make sure this path is correct relative to your backend file
const distPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(distPath));
console.log("Current directory:", __dirname);
console.log("Frontend dist path:", path.join(__dirname, "frontend", "dist"));

// Serve the index.html correctly for all routes
app.get("*", (_, res) => {
  const indexPath = path.join(distPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
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