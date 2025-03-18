import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role Name is requird"],
      unique: [true, "Role name is already exist"],
    },
  },
  { timeseries: true }
);

export const Role = mongoose.model("Role", roleSchema);
