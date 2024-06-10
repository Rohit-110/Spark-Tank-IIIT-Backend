import express from "express";
import { getmyprofile, login, logout, register} from "../controllers/student.js";



const router= express.Router();



router.post('/new',register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/me',getmyprofile);

router.get('/hello',(req,res)=>{
    res.send("Hello  World");
})
export default router;


