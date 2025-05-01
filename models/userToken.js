import mongoose from "mongoose";

const tokenSchema = mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        },
        token:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now,
            expire:300
        }
    }
)

export const Token = new mongoose.model("Token", tokenSchema)