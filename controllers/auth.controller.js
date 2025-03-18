import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Role } from "../models/role.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, username, email, password, userRole } = req.body;
  if (!firstName) {
    throw new ApiError(400, "First name is required");
  }
  if (!lastName) {
    throw new ApiError(400, "Last name is required");
  }
  if (!username) {
    throw new ApiError(400, "Username is required");
  }
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  if (!password) {
    throw new ApiError(400, "password is required");
  }
  if (!userRole) {
    throw new ApiError(400, "Role is required");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const usrRole = await Role.findOne({ role: userRole });

  // console.log(usrRole);
  if (!usrRole) {
    throw new ApiError(404, "User Role not found");
  }

  const user = new User({
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
    password: hashPassword,
    userRole: usrRole,
  });
//  console.log(user);
  await user.save();
  res.status(201).json(new ApiResponse(201, "User is created", user));
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate("userRole", "role");
  
  // Find role from role collection
  // const role = await Role.findOne({_id:user.userRole})

  if (!user) {
    throw new ApiError(404, "Invalid credentials please check it"); // Avoid revealing which field is incorrect
  }

  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new ApiError(400, "Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role:user.userRole.role  },
    process.env.SECRET_KEY,
    { expiresIn: "1h" } // Corrected format
  );

  res.status(200).json(new ApiResponse(200, "User is logged in",  token ));
});


export const logout = asyncHandler(async (req, res, next) => {
  try {
    // To log out, we can clear the token on the client side
    // But if using cookies, we can clear them like this:
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensures secure cookies in production
      sameSite: "strict",
    });
    
    res.status(200).json(new ApiResponse(200, "User has been logged out"));
  } catch (error) {
    next(new ApiError(500, "Something went wrong while logging out"));
  }
});
