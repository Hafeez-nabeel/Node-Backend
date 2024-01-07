import express, { json } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";
// config dotenv file at the top level
dotenv.config();

connectDB();

//
// initialize express application
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//multer

import studentRoutes from "./routes/studentRoutes.js";
// import authRoute from "./controllers/authcontroller.js";
import authRoutes from "./routes/authRoutes.js";
app.use("/api/v1/attendance", studentRoutes, authRoutes);
// app.use("/api/v1/auth", authRoutes);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
  secure: true,
});
app.use((err, req, res, next) => {
  // copy of err object
  let error = { ...err };
  // assigning err message to custom error object
  error.message = err.message;

  // Handling mongoose validation error
  if (err.name === "ValidationError") {
    // itterating error through the error object and assigning err values to message // array of strings
    const message = Object.values(err.errors).map((value) => value.message);
    // finally assigning all erros mesages to our custom error object
    error = new Error(message);
  }

  // Handling mongoose duplication key errors
  if (err.code === 11000) {
    // itterating error through the error object and assigning err values to message // array of strings
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    // finally assigning all erros mesages to our custom error object
    error = new Error(message);
  }

  if (err.name === "CastError") {
    const message = `Resource not found: Invalid  ${err.path} `;
    //  assigning all erros mesages to our custom error object
    error = new Error(message);
  }
  console.log(error);
  res.json({
    error: error.message,
  });
});
app.listen(PORT, () => {
  console.log(`Example app listening on http://localhost:${PORT}`);
});
