import mongoose from "mongoose";
import colors from "colors";
// import dotenv from "dotenv";
// dotenv.config();

// mongoose.connect(process.env.MONGO_URL);
// mongoose.connection.on("connected", () => console.log("MongoDB Connected"));
// mongoose.connection.on("error", (err) => console.log("MongoDB Error", err));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected to", mongoose.connection.host.bgGreen.white);
  } catch (error) {
    console.log(`MongoDB Error: ${error}`.bgRed.white);
  }
};

export default connectDB;
