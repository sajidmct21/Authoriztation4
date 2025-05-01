import { Book } from "../models/book.model.js";
import { asyncHandler } from "../utils/asyncHandle.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js";
 
export const getAllBooks = asyncHandler(async (req,res,)=>{
    const books = await Book.find();
      if (books.length === 0) {
        throw new ApiError(401, "No Book to find");
      }
      return res.status(200).json(new ApiResponse(200, "All Books are fetched", books));
})