import mongoose from "mongoose";


const userSchema= new mongoose.Schema({
    name : String,
    email : {type : String, unique : true},
    password : {type : String},
    googleId : {type : String},
    picture : String
},{timestamps : true});

export default mongoose.model("User",userSchema);