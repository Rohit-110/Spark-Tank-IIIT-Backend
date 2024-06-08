import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import paymentRoute from './routes/paymentRoutes.js';

export const app = express();



config({path : "./config/config.env"});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.use('/api',paymentRoute);
