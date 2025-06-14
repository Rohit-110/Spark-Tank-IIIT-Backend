import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Student } from "../models/student.js";
import { sendCookie } from "../utils/feature.js";
import { instance } from "../server.js"
import crypto from 'crypto'
import { Payment } from "../models/paymentModel.js";


export const register = async (req, res) => {
    
    const { name, email, password, mobile,batchYear, degree ,studentId } = req.body;
    console.log(req.body);

    try {
        let student = await Student.findOne({ email });

        if (student) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const student1 = await Student.create({ name, email, password: hashedPassword, mobile,batchYear,degree,studentId });

        sendCookie(student1, res, "Registered Successfully", 200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const student = await Student.findOne({ email }).select("+password");
    if (!student){
        return res.status(404).json({
            success: false,
            message: "Invalid Email id or Password",
        });
    }
    const username = student.name;
    bcrypt.compare(password, student.password, (err, isMatch) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
        if (!isMatch) {
            return res.status(404).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }
        sendCookie(student, res, "Welcome back, " + username, 200);
    });
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(404).json({
            success: false,
            message: "Login First",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach decoded user data to request object
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};


export const getmyprofile = async (req,res)=>{
    const { token }=req.cookies;

    if(!token)
    return res.status(404).json({
        success: false,
        message:"Login First",
    });

    const decoded= jwt.verify(token,process.env.JWT_SECRET);
    const student= await Student.findById(decoded._id);

    res.status(200).json({
        success:true,
        student,
    })
};


export const logout = async (req,res)=>{
    res
    .status(200)
    .cookie("token","",{
        expires:new Date(Date.now()) ,
        sameSite: process.env.NODE_ENV==="Development" ? "lax" :"none",
        secure: process.env.NODE_ENV==="Development" ? false :true,
    })
    .json({
        success:true,
        message: "You are Logged Out",
    })
};


export const updatemyprofile=async(req,res)=>{
    const { _id, name, email, password, mobile , enrollment_no , batch} = req.body;
    try {
        let student = await Student.findOneAndUpdate({ email }, { $set: { name, password, mobile, batch, enrollment_no } });

        if (student) {
            return res.status(200).json({
                success: true,
                message: "Profile Updated Successfully",
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const checkout= async(req,res)=>{
    try{
        const options ={ 
            amount: Number(req.body.amount)*100, 
            currency: "INR",
        };
        const orders = await instance.orders.create(options);

        res.status(200).json({
            success:true,
            orders,
        })
    }catch(err){
        console.log(err.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const generatedSignature = crypto
            .createHmac("SHA256", process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest("hex");


        const isAuthenticated = razorpay_signature === generatedSignature;
        console.log(razorpay_signature );
        console.log(generatedSignature );

        if (isAuthenticated) {
            try {
                await Payment.create({
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                });
                console.log("check");
                res.redirect(`https://spark-tank-iiit-frontend.vercel.app/paymentsuccess?reference=${razorpay_payment_id}`);
            } catch (error) {
                console.error('Error creating payment record:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error creating payment record',
                });
            }
        } else {
            return res.status(500).json({
                success: false,
                message: 'Invalid signature',
            });
        }
    } catch (error) {
        console.error('Error during payment verification:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
