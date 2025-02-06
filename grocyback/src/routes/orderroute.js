import { Router } from 'express'
import verifyToken from '../middlewares/token.js';
import { orderSingleItem } from '../controllers/ordercontrol.js';
import { calculateDistance } from '../middlewares/distanceCalculate.js';
const router = Router();
router.route("/orderSingleItem").post(verifyToken,calculateDistance,orderSingleItem)
export default router