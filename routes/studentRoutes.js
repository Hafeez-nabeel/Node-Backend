import express from "express";
import { checkIn, createStudent, deletestudent, getAllStudents, getStudent, register, updateStudent, uploadImage } from "../controllers/studentcontroller.js";
import { upload } from "../utils/helpers/multer.js";
import protectRoute from "../middlewares/ProtectRoute.js";
// import protectRoute from "../middlewares/ProtectRoute.js";

// routes
const router = express.Router();

// create routes
router.post("/register", register);
router.get("/students", protectRoute, getAllStudents);
router.get("/student/:id", getStudent);
router.post("/create", createStudent);
router.post("/update/:id", updateStudent);
router.post("/checkin", checkIn);
router.delete("/delete/:id", deletestudent);
router.post("/upload", upload.single("file"), uploadImage);
// router.post("/login", logIn);
// router.post("/logout", logOut);
// can not follow or unfollow if user is not logged in
//Protected route by middleware
// router.post("/follow/:id", protectRoute, followUnFollow);
// router.put("/update/:id", protectRoute, updateUser);

export default router;
