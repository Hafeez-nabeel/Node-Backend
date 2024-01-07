import { Student } from "../models/studentsModel.js";
import { Admin } from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return next(new Error("Student not found"));
    }

    const isPasswordMatched = await bcrypt.compare(password, student.password);

    if (!isPasswordMatched) {
      return next(new Error("bad credentials"));
    }

    const token = await jwt.sign({ payload: student }, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });

    res.cookie("token", token, { httpOnly: true }).status(200).json({
      student,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    status: "You are logged out",
  });
};

export { login, logout };
