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
    origin:['http://localhost:3001','https://grocify-now.vercel.app'],
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept']
}
app.use(cors(corsOption));
app.options("*", cors(corsOptions));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://grocify-now.vercel.app"); // Allow frontend
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
  
    if (req.method === "OPTIONS") {
      return res.sendStatus(200); // Preflight request should end here
    }
  
    next();
  });
import userRoutes from './src/routes/userroute.js'
app.use("/user",userRoutes);
import apiRoutes from './src/routes/grocyapiroute.js'
app.use("/api",apiRoutes);
import cartRoutes from "./src/routes/cartroute.js"
app.use("/cart",cartRoutes);
import orderRoutes from "./src/routes/orderroute.js"
import { addWarehouse } from './src/controllers/warehousecontrol.js'
app.use("/orders",orderRoutes);
app.use("/addWarehouse",addWarehouse)
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