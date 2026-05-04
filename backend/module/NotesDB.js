import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
},{timestamps:true}); // createdAt , UpdatedAt

const Notedb = mongoose.model("Notedb",noteSchema)

export default Notedb;