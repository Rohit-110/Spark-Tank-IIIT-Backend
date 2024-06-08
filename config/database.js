import mongoose from "mongoose";
export const connectdb= async(req,res)=>{
    try{
        const {connection } = await mongoose.connect(process.env.Mongo_URI);
        console.log(`MongoDB is connected with ${connection.host}`);
    }catch(err){
        console.log(err.message);
    }
}