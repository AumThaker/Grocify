import User from "../models/usermodel.js";
import GrocyAPI from "/aum/Internship/grocyback/src/models/grocymodel.js";

const orderSingleItem = async (req, res) => {
  const { productId, quantity } = req.query;
  if (!productId)
    return res.status(400).json({ message: "PRODUCT NOT AVAILABLE" });
  const item = await GrocyAPI.findById(productId);
  if (quantity > item.stock)
    return res.status(400).json({ message: "OUT OF STOCK" });
  const user = await Userer.findById(req.user._id);
  if (!user) return res.status(400).json({ message: "USER NOT FOUND" });
};
export { orderSingleItem };
