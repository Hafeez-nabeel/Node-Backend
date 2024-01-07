import mongoose from "mongoose";
const { Schema } = mongoose;

const attandanceschema = Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },

    checkIn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Attandance = mongoose.model("Attandance", attandanceschema);
