import User from "../models/usermodel.js";
import GrocyAPI from "/aum/Internship/grocyback/src/models/grocymodel.js";
const addToCart = async (req, res) => {
  const { productId } = req.query;
  if (!productId)
    return res.status(404).json({ message: "Cannot find grocery" });
  const grocy = await GrocyAPI.findById(productId);
  if (!grocy) return res.status(404).json({ message: "Grocery not found" });
  let cartItemId = grocy._id;
  let user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const alreadyExists = user.cart.some(
    (item) => item.productId.toString() === cartItemId.toString()
  );
  if (alreadyExists)
    return res.status(200).json({ message: "Item already in cart" });
  await user.cart.push({ productId: cartItemId });
  await user.save();
  return res.status(200).json({ message: "Added To Cart", addedItem: grocy });
};
const cartItems = async (req, res) => {
  const userId = req.user._id;
  if (!userId) return res.status(400).json({ message: "USER NOT LOGGED IN" });
  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ message: "USER NOT FOUND" });
  const products = user.cart;
  try {
    const cartItems = await Promise.all(
      products.map(async (product) => {
        const item = await GrocyAPI.findById(product.productId);
        return item;
      })
    );
    return res.status(200).json({ message: "Cart Fetched", cart: cartItems });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching cart items" });
  }
};

const changeQuantity = async (req, res) => {
  const { productId, quantity } = req.query;
  if (!productId)
    return res.status(400).json({ message: "Cannot change quantity" });
  const item = await GrocyAPI.findById(productId);
  if (quantity > item.stock)
    return res.status(400).json({ message: "Out Of Stock" });
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).json({ message: "User not found" });
  const cartItemToUpdate = user.cart.find(item => item.productId.toString() === productId);
    if (cartItemToUpdate) {
      cartItemToUpdate.quantity = quantity;
    } else {
      return res.status(400).json({ message: "Item not found in cart" });
    }
  await user.save()
  return res.status(200).json({message:"Quantity changed"});
};
export { addToCart, cartItems, changeQuantity };
