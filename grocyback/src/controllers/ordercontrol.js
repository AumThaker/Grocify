import mongoose from "mongoose";
import User from "../models/usermodel.js";
import GrocyAPI from "/aum/Internship/grocyback/src/models/grocymodel.js";

const orderSingleItem = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId)
    return res.status(400).json({ message: "PRODUCT NOT AVAILABLE" });
  const item = await GrocyAPI.findById(productId);
  if(!item) return res.status(404).json({message:"ITEM NOT FOUND"})
  if (quantity > item.stock)
    return res.status(400).json({ message: "OUT OF STOCK" });
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).json({ message: "USER NOT FOUND" });
  const distance = req.distance
  const duration = req.duration
  const deliveryCharge = req.deliveryCharges
  if(distance > 30000) return res.status(400).json({message:"NOT AVAILABLE IN YOUR REGION"})
  const totalPrice = (item.price*quantity) + deliveryCharge;
  return res.status(200).json({message:"ORDERED HALF WAY",groceryPrice:item.price*quantity,deliveryCharge:deliveryCharge,total:totalPrice})
};
export { orderSingleItem };
