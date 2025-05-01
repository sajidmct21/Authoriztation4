import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title:{
        type:String,
        required:true
    },
    isbn13:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
  },
  { timeseries: true }
);

export const Book = mongoose.model("Book", bookSchema);
