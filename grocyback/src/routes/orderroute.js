import { Router } from 'express'
import verifyToken from '../middlewares/token.js';
import { orderSingleItem } from '../controllers/ordercontrol.js';
const router = Router();
router.route("/orderSingleItem").post(verifyToken,orderSingleItem)
export default router