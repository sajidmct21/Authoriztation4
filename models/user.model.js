import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exist please change it"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exist please change it"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profileImage: {
      type: String,
      required: false,
    },
    userRole: {
      type: Schema.Types.ObjectId,
      // type: "isObjectId",
      required: [true, "Role is requird"],
      ref: "Role",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
