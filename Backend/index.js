import "dotenv/config";
import connectDB from "./src/db/index.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import userRouter from "./src/routes/user.routes.js";
// import fs from "fs";
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
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (_, res) => {
  // res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});


// Serve frontend build files
// const distPath = path.join(__dirname, "frontend", "dist");  // Changed: Corrected the path to `frontend/dist`
// console.log("Current directory:", __dirname);  // Debugging: Print the current directory
// console.log("Frontend dist path:", distPath);  // Debugging: Print the resolved path to `frontend/dist`

// // Serve static files from the dist directory (frontend build files)
// app.use(express.static(distPath));

// // Serve index.html for all routes
// app.get("*", (_, res) => {
//   const indexPath = path.join(distPath, "index.html");  // Changed: Use the corrected path for index.html
  
//   // Debugging: Check if index.html exists at the specified path
  
//   if (fs.existsSync(indexPath)) {
//     console.log('index.html exists at', indexPath);
//   } else {
//     console.error('index.html not found at', indexPath);
//   }

//   // Send the index.html file for all routes
//   res.sendFile(indexPath, (err) => {
//     if (err) {
//       console.error('Error serving index.html:', err);  // If there's an error serving the file
//       res.status(500).send('Internal Server Error');  // Return 500 if there's an error
//     }
//   });
// });


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