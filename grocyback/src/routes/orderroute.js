import { Router } from 'express'
import verifyToken from '../middlewares/token.js';
import { addToOrder, createOrderSingleItem } from '../controllers/ordercontrol.js';
import { calculateDistance } from '../middlewares/distanceCalculate.js';
const router = Router();
router.route("/createOrderSingleItem").post(verifyToken,calculateDistance,createOrderSingleItem)
router.route("/addToOrder").post(verifyToken,addToOrder)
export default router