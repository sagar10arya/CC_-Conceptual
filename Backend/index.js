import "dotenv/config";
import connectDB from "./src/db/index.js";
import userRouter from "./src/routes/user.routes.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
VITE_INSTAGRAM_ACCESS_TOKEN=IGAANL0Tb7LFZABZAE82YTFUTU1aZA1RUWmNOU1ZA3Vi15cWZAMWXZAhLXp5dG45ODdkY1NYTmdzRHJkOUdkU3N2MW5XelBrV1lMOVNnb0JOdHhuT3h3WTdaRXpDOGlWdlNocE5ZAMWRDdzh0UFRpMjFZAQXFmUUpGT05zak9Wd0I2MWlhWQZDZD
VITE_API_URL=https://conceptual.onrender.com/api/v1

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ✅ Routes
app.use("/api/v1/users", userRouter);

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
