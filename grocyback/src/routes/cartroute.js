import { Router } from 'express'
import verifyToken from '../middlewares/token.js';
import { addToCart, cartItems, changeQuantity } from '../controllers/cartcontrol.js';
const router = Router();
router.route("/addToCart").post(verifyToken,addToCart)
router.route("/cartItems").post(verifyToken,cartItems)
router.route("/changeQuantity").post(verifyToken,changeQuantity)
export default router