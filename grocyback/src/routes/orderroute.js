import { Router } from 'express'
import verifyToken from '../middlewares/token.js';
import { addToOrder, createOrderAllItems, createOrderSingleItem, fetchOrders } from '../controllers/ordercontrol.js';
import { calculateDistance } from '../middlewares/distanceCalculate.js';
const router = Router();
router.route("/createOrderSingleItem").post(verifyToken,calculateDistance,createOrderSingleItem)
router.route("/createOrderAllItems").post(verifyToken,calculateDistance,createOrderAllItems)
router.route("/addToOrder").post(verifyToken,addToOrder)
router.route("/fetchOrders").post(verifyToken,fetchOrders)
export default router