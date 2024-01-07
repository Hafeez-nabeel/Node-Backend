import mongoose from "mongoose";
const { Schema } = mongoose;

const adminSchema = Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    istype: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = mongoose.model("Admin", adminSchema);
