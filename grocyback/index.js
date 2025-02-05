import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDB from "./src/db/db.js"
const app = express();
dotenv.config({path:"./.env"});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOption = {
    origin:['http://localhost:3001'],
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept']
}
app.use(cors(corsOption));
import userRoutes from './src/routes/userroute.js'
app.use("/user",userRoutes);
import apiRoutes from './src/routes/grocyapiroute.js'
app.use("/api",apiRoutes);
import cartRoutes from "./src/routes/cartroute.js"
app.use("/cart",cartRoutes);
import orderRoutes from "./src/routes/orderroute.js"
app.use("/cart",orderRoutes);
const startServer = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT || 3000, () => {
            console.log("SERVER STARTED AT PORT", process.env.PORT || 3000);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};
startServer();