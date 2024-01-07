import { Admin } from "../models/adminModel.js";
import { Student } from "../models/studentsModel.js";
import { Attandance } from "../models/attandanceModel.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// @description  create admin
//route POST /api/v1/admin/register
//access Private

const register = async (req, res) => {
  const data = req.body;
  const hashedpassword = await bcrypt.hash(data.password, await bcrypt.genSalt(10));
  try {
    const admin = new Admin({
      name: data.name,
      email: data.email,
      password: hashedpassword,
    });
    await admin.save();

    return res.status(200).json({
      message: "Admin regiseted successfully",
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "failed",
      hint: "catch block accessed",
    });
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const allstudents = await Student.find({}).select("-password");
    if (!allstudents) {
      return next(new Error("No students found"));
    }
    const students = allstudents.filter((student) => student.istype !== "admin");
    if (students.length <= 0) {
      return next(new Error("No students found"));
    }
    res.status(200).json({
      students,
    });
  } catch (error) {
    next(error);
  }
};

const getStudent = async (req, res, next) => {
  const { id } = req.params;
  try {
    const student = await Student.findById({ _id: id }).select("-password");

    if (!student) {
      return next(new Error("Student not found"));
    }
    return res.status(200).json({
      student,
    });
  } catch (error) {
    next(error);
  }
};
const createStudent = async (req, res, next) => {
  const { firstname, lastname, image, phone, email, coursename, password } = req.body;

  try {
    const hashedpassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const student = new Student({
      firstname,
      lastname,
      email,
      image,
      phone,
      coursename,
      password: hashedpassword,
    });
    await student.save();

    return res.status(200).json({
      message: "Student regiseted successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// const createStudent = async (req, res) => {
//   const { firstname, lastname, image, phone, email, coursename } = req.body;
//   // const emptyDatabase = await isEmpty();

//   try {
//     if (!firstname || !lastname || !coursename || !email) {
//       return res.status(400).json({
//         message: "Invalid fields: only password is optional",
//       });
//     }

//     const isStudentExist = await Student.findOne({ email });
//     if (isStudentExist) {
//       return res.status(400).json({
//         message: "Student already exists",
//       });
//     }
//     const student = new Student({
//       firstname,
//       lastname,
//       email,
//       image,
//       phone,
//       coursename,
//     });
//     await student.save();

//     return res.status(200).json({
//       message: "Student regiseted successfully",
//       data: student,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//       status: "failed",
//       hint: "catch block accessed",
//     });
//   }
// };

const updateStudent = async (req, res, next) => {
  const id = req.params.id;
  const { firstname, lastname, password, email } = req.body;

  const hashedpassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, {
      firstname,
      lastname,
      password: hashedpassword,
      email,
    });

    //when the mongoose id length is matched but the requested id is tempered
    if (!updatedStudent) {
      return next(new Error("Student not found"));
    }
    return res.json(updatedStudent);
  } catch (error) {
    return next(error);
  }
};

const deletestudent = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deletedStudent = await Student.deleteOne({ _id: id });
    //when the mongoose id length is matched but the requested id is tempered
    if (deletedStudent.deletedCount === 0) {
      return next(new Error("Student not found"));
    } else {
      return res.status(200).json({
        message: "student deleted successfully",
      });
    }
  } catch (error) {
    return next(error);
  }
};

const uploadImage = async (req, res, next) => {
  console.log("file: ", req.file.path); //is the `image` file
  const path = req.file.path;
  // console.log("body: ", req.body); //will hold the text fields, if there were any
  cloudinary.uploader.upload(path, (error, data) => {
    if (error) {
      return res.json({
        message: "unable to upload image on cloudinary please try again",
      });
    }
    res.json({
      message: "image uploaded successfully",
      data,
    });
    ///delete file
    fs.unlinkSync(path);
  });
};

//Check in
const checkIn = async (req, res, next) => {
  const { studentId } = req.body;

  try {
    // Check the last check-in time for the student
    const lastCheckIn = await Attandance.findOne({ studentId }).sort({ checkIn: -1 });
    if (!lastCheckIn) {
      const newCheckIn = new Attandance({
        studentId,
      });
      await newCheckIn.save();
      return res.status(200).json({
        newCheckInTime: newCheckIn,
        status: "success",
      });
    }

    let lastcheckInTime = new Date(lastCheckIn.checkIn);
    let currentTime = new Date();
    const timeDiffrence = Math.abs(lastcheckInTime - currentTime);
    const difhours = Math.floor(timeDiffrence / (1000 * 60 * 60));
    if (difhours >= 23) {
      const newCheckIn = new Attandance({
        studentId,
      });
      return res.status(200).json({
        newCheckInTime: newCheckIn,
        status: "success",
      });
    } else {
      return next(new Error("already checked in"));
    }
  } catch (error) {
    return next(error);
  }
};

export { register, createStudent, getAllStudents, getStudent, updateStudent, deletestudent, uploadImage, checkIn };
