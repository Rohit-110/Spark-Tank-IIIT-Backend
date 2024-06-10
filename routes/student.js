import express from "express";
import { getmyprofile, login, logout, register} from "../controllers/student.js";
import { checkout, paymentVerification } from "../controllers/student.js";



const router= express.Router();



router.post('/new',register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/me',getmyprofile);

router.route('/checkout').post(checkout);
router.route('/paymentverification').post(paymentVerification);
router.get('/getkey',(req,res)=>{
    res.status(200).json({
        key : process.env.RAZORPAY_API_KEY
    })
})

router.get('/hello',(req,res)=>{
    res.send("Hello  World");
})
export default router;


