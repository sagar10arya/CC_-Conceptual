import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    // origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Use environment variables for production
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allows cookies to be sent
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());


// routes
import userRouter from './routes/user.routes.js'


// routes declaration
app.use("/api/v1/users", userRouter)


export { app };
