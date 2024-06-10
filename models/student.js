import mongoose from "mongoose";

const schema1 = new mongoose.Schema({
    name: {
       type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    batchYear:{
        type: Number,
    },
    studentId:{
        type: String,
    },
    degree:{
        type: String,
    },
    mobile:{
        type: Number,
    },
});
export const Student = mongoose.model("student",schema1);
