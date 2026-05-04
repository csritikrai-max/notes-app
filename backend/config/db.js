import mongoose from "mongoose";

export const connectdb = async()=>{
    try {
        await mongoose.connect(process.env.mongo_uri);
        console.log("Database Connected Successfully!!!")
    } catch (error) {
        console.log("Couldn't Conncet to Database",error);
    }
}
