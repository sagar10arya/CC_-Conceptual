import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path'

const app = express();

const __dirname = path.resolve();

app.use(
  cors({
    // origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Use environment variables for production
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Allows cookies to be sent
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/frontend/dist")))
app.get('*', (_,res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
})

// routes
import userRouter from './src/routes/user.routes.js'


// routes declaration
app.use("/api/v1/users", userRouter)


export { app };
