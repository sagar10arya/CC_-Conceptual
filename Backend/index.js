import "dotenv/config";
import connectDB from "./src/db/index.js";
import userRouter from "./src/routes/user.routes.js";
import adminRouter from "./src/routes/admin.routes.js";
import galleryRouter from "./src/routes/gallery.routes.js";
// import instagramRoutes from "./src/routes/instagram.routes.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

const app = express();

// CORS Setup
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://www.conceptualclassess.com",
        "https://conceptualclassess.com",
        "https://conceptual.onrender.com",
        "http://localhost:5173",
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Authorization"],
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// API Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/gallery", galleryRouter);
app.use("/api/v1/admin", adminRouter);
// app.use("/api/v1/gallery", instagramRoutes);

// Debug all API hits
app.use("/api/*", (req, res, next) => {
  console.log("API route hit:", req.method, req.originalUrl);
  next();
});

// Serve Frontend (only for non-API routes)
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "frontend", "dist");

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Only handle NON-API frontend routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  console.error(
    "❌ dist folder not found. Did you run `npm run build` in frontend?"
  );
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // If headers already sent, delegate to default handler
  if (res.headersSent) {
    return next(err);
  }
  
  // Send JSON response for API errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// In your backend (e.g., server.js)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Connect DB & Start Server
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
