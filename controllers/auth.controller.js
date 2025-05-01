import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Role } from "../models/role.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Token } from "../models/userToken.js";
import nodemailer from "nodemailer";

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
    { id: user._id, email: user.email, role: user.userRole.role },
    process.env.SECRET_KEY,
    { expiresIn: "1h" } // Corrected format
  );
  const userWithoutPassword = {
    _id: user._id,
    email: user.email,
    username:user.username,
    firstName: user.firstName,
    lastName:user.lastName, // if name exists
    role: user.userRole.role,
    token:token
    // include other fields you want to send
  };
  // console.log(userWithoutPassword)
  res.status(200).json(new ApiResponse(200, "User is logged in", userWithoutPassword));
});

export const logout = asyncHandler(async (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, "User has been logged out"));;
  } catch (error) {
    next(new ApiError(500, "Something went wrong while logging out"));
  }
});

export const sendEmail = asyncHandler(async (req, res, next) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: { $regex: "^" + email + "$", $options: "i" },
  });
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  const payload = {
    email: user.email,
  };
  const expiryTime = 300;
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: expiryTime,
  });

  const newToken = new Token({
    userId: user._id,
    token: token,
  });

  const mailTranspoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ecrimereportingsystem@gmail.com",
      pass: "mbgkqduovlpypang",
    },
  });
  let mailDetails = {
    from: "ecrimereportingsystem@gmail.com",
    to: email,
    subject: "Reset the Password",
    html: `
    <html>
    <head>
    <title>Password Reset Request</title>
    </head>
    <body>
        <h1>Password Reset Request </h1>
    <p>Dear ${user.username}, </p>
    <p>We have received a request to reset the password. To complete the preocss click on button</p>
    <a href=${process.env.LIVE_URL}/reset-password/${token}><buuton style="background-color:blue; color:white; padding:14px 20px">Reset Password</button></a>
    <p>Thanks You</p>
    </body>
    </html>
    `,
  };
  mailTranspoter.sendMail(mailDetails, async (err, data) => {
    if (err) {
      throw new ApiError(500, "Some thing went wrong while sending email");
    } else {
      await newToken.save();
      return next(new ApiResponse(200, "Email sent successfully"));
    }
  });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      throw new ApiError(500, "Password Link is expired");
    } else {
      const response = data;
      const user = await User.findOne({
        email: { $regex: "^" + response.email + "$", $options: "i" },
      });
      const salt = await bcrypt.genSalt(10);
      const encryptPassword = await bcrypt.hash(newPassword, salt);
      user.password = encryptPassword;
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: user },
          { new: true }
        );
        res
          .status(200)
          .json(new ApiResponse(200, "Reset Password Successfully"));
      } catch (error) {
        throw new ApiError(
          500,
          "Something went wrong while reset the password"
        );
      }
    }
  });
});
