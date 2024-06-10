import { Form } from "../models/form.js";
import { Student } from "../models/student.js";
import { sendCookie } from "../utils/feature.js";
import jwt from "jsonwebtoken";


export const submitform = async (req, res, next) => {
  const {
    name,
    enrollmentNo,
    batch,
    mobileNo,
    emailId,
    age,
    aadharNo,
    ideaSubject,
    detailedDescription,
    marketSize,
    targetMarket,
    marketingPlan,
    potentialRisks,
    salesStrategy,
    amountRequest      
  } = req.body;

  const { token }=req.cookies;
  const decoded= jwt.verify(token,process.env.JWT_SECRET);
  try {
    await Form.create({
        name,
        enrollmentNo,
        batch,
        mobileNo,
        emailId,
        age,
        aadharNo,
        ideaSubject,
        detailedDescription,
        marketSize,
        targetMarket,
        marketingPlan,
        potentialRisks,
        salesStrategy,
        amountRequest, 
        user: decoded._id, 
    });

    if(!token)
    return res.status(404).json({
        success: false,
        message:"Login First",
    });
    const users= await Student.findById(decoded._id);

    res.status(201).json({
      success: true,
      message: "Form Submitted Successfully by " + users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getmyform = async (req, res, next) => {
    try {
        let { token } = req.cookies;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Assuming Entrepreneur is directly associated with the User model
        const entrepreneur = await Form.find({ user: decoded._id });

        res.status(200).json({
            success: true,
            entrepreneur,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Login first",
        });
    }
};

export const getallform = async (req, res, next) => {
    try {
        const entrepreneur = await Form.find({}).toArray();;

        res.status(200).json({
            success: true,
            entrepreneur,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Login first",
        });
    }
};
