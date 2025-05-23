import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import entrepreneurRouter from './routes/form.js';
import studentRouter from './routes/student.js';

export const app = express();



config({path : "./config/config.env"});


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true,
}))

app.set('view engine', 'ejs');

app.use("/api/user",studentRouter);
app.use("/api/form",entrepreneurRouter);
