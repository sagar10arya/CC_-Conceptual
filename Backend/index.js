import "dotenv/config";
import connectDB from "./src/db/index.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // ✅ Required for ES Modules

const app = express();

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the frontend dist path
const distPath = path.join(__dirname, "frontend", "dist");

// Debugging: Check if `dist` folder exists
console.log("🔹 Serving frontend from:", distPath);
if (!fs.existsSync(distPath)) {
  console.error("❌ ERROR: dist folder not found at", distPath);
} else {
  console.log("✅ dist folder found!");
}

// ✅ Serve frontend build files
app.use(express.static(distPath));

// ✅ Serve index.html for unknown routes (Single Page Application)
app.get("*", (_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ✅ Routes
app.use("/api/v1/users", userRouter);

// ✅ Connect to Database and Start Server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGO DB connection failed:", err);
  });
