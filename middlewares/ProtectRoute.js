// import { User } from "../models/userModel.js";
// it should have three parameter "req , res, next"
// if user is loggen in there must be jwt token in cookie
//get jwt token from cookie
import jwt from "jsonwebtoken";
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new Error("you are not authorized"));
    }
    const { payload } = jwt.verify(token, process.env.SECRET_KEY);

    if (!payload) {
      return next(new Error("invalid token"));
    }

    // console.log(decoded);
    // req.user = user;
    delete payload.password;
    req.student = payload;
    // const user = await User.findById(decoded.userId).select("-password");
    next();
    // next();
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

export default protectRoute;
