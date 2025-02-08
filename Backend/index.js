import "dotenv/config";
import connectDB from "./src/db/index.js";
import userRouter from "./src/routes/user.routes.js";
import instagramRoutes from './src/routes/instagram.routes.js'
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { log } from "console";

const app = express();

// ✅ Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/gallery", instagramRoutes); 

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://www.conceptualclassess.com",
      "https://conceptualclassess.com",
      "https://conceptual.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"], // Ensure allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log(`Incoming Request: ${req.method} ${req.url}`);
//   next();
// });


// ✅ Serve Frontend (Only if dist/ exists)
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "frontend", "dist");

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  console.error(
    "❌ dist folder not found. Did you run `npm run build` in frontend?"
  );
}

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
