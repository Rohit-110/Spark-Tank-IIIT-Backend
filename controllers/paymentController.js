import { instance } from "../server.js"
import crypto from 'crypto'
import { Payment } from "../models/paymentModel.js";

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

        if (isAuthenticated) {
            try {
                await Payment.create({
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                });
                res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`);
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
