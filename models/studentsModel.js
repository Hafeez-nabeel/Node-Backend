import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = Schema(
  {
    firstname: {
      type: String,
      // required: true,
    },
    lastname: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: [true, "please provide valid email address"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please  provide password"],
    },
    image: {
      type: String,
      default: "url",
      // required: true,
    },
    coursename: {
      type: String,
      // required: true,
    },
    id: {
      type: Number,
      unique: true,
      default: Date.now,
    },

    phone: {
      type: String,
      default: "not available",
    },
    istype: {
      type: String,
      default: "student",
    },
    attendance: {
      type: Schema.Types.ObjectId,
      ref: "Attandance",
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", studentSchema);
