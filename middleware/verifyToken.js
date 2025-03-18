import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyToken = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header("Authorization");
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      throw new ApiError(400, "No token found");
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        throw new ApiError(400, "Token is not valid");
      }
      req.user = user;
      next();
    });
  } catch (error) {
    next(new ApiError(error.statusCode, `${error.message}`));
  }
};
