import { Router } from 'express'
import verifyToken from '../middlewares/token.js';
import { addToCart, cartItems, changeQuantity, removeFromCart } from '../controllers/cartcontrol.js';
const router = Router();
router.route("/addToCart").post(verifyToken,addToCart)
router.route("/cartItems").post(verifyToken,cartItems)
router.route("/changeQuantity").post(verifyToken,changeQuantity)
router.route("/removeFromCart").post(verifyToken,removeFromCart)
export default router