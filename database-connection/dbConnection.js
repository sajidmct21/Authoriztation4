import mongoose from "mongoose";

export const dbConnection = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`DATABASE IS CONNECTED`); 
    } catch (error) {
       console.log(`MongoDB connection failed\n`, error);
       process.exit(1) 
    }``
}