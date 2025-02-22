import { Router } from "express";
import {GrocyAdd,GrocyVegAllInfo,GrocyFruitAllInfo,GrocyUpdateStock} from '../controllers/grocyapicontrol.js'
const router = Router();
router.route("/grocyAdd").post(GrocyAdd);
router.route("/grocyVegInfo").post(GrocyVegAllInfo);
router.route("/grocyFruitInfo").post(GrocyFruitAllInfo);
router.route("/grocyStockChange").post(GrocyUpdateStock);
export default router