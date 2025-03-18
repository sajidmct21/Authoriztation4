import { asyncHandler } from "../utils/asyncHandle.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  if (users.length === 0) {
    throw new ApiError(401, "No User to find");
  }
  return res.status(200).json(new ApiResponse(200, "All Users", users));
});

export const getUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(401`${id} does not exist`);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(401, `${id} is not valid`);
  }
  const usr = await User.findById(req.params.id);
  if (!usr) {
    throw new ApiError(401, `Not Found`);
  }

  res.status(200).json(new ApiResponse(200, "User Data", usr));
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(401`${id} does not exist`);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(401, `${id} is not valid`);
  }
  const usr = await User.findById(req.params.id);
  if (!usr) {
    throw new ApiError(401, `Not Found`);
  }
  const newUser = await User.findByIdAndUpdate(id, req.body, {new:true} );
  res.status(200).json(new ApiResponse(200, "User Data", newUser));
});

export const deleteUser = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
      throw new ApiError(401`${id} does not exist`);
    }
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(401, `${id} is not valid`);
    }
    const usr = await User.findById(req.params.id);
    if (!usr) {
      throw new ApiError(401, `Not Found`);
    }
    const newUser = await User.findByIdAndDelete(id);
    res.status(200).json(new ApiResponse(200, "User is deleted"));
  });
