import mongoose from "mongoose";
import User from "../models/usermodel.js";
import GrocyAPI from "/aum/Internship/grocyback/src/models/grocymodel.js";
import razorpay from "razorpay";
import Orders from "../models/orders.js";

const createOrderSingleItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId)
      return res.status(400).json({ message: "PRODUCT NOT AVAILABLE" });
    const item = await GrocyAPI.findById(productId);
    if (!item) return res.status(404).json({ message: "ITEM NOT FOUND" });
    if (quantity > item.stock)
      return res.status(400).json({ message: "OUT OF STOCK" });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "USER NOT FOUND" });
    const distance = req.distance;
    const duration = req.duration;
    const deliveryCharge = req.deliveryCharges;
    if (distance > 30000)
      return res.status(400).json({ message: "NOT AVAILABLE IN YOUR REGION" });
    const totalPrice = item.price * quantity + deliveryCharge;
    const totalInPaise = totalPrice * 100;
    let instance = new razorpay({
      key_id: process.env.RAZORPAYID,
      key_secret: process.env.RAZORPAYSECRET,
    });
    const newOrder = await instance.orders.create({
      amount: totalInPaise,
      currency: "INR",
      notes: { description: "Grocify Shopping" },
    });

    const responseObject = {
      userDetails: {
        name: user.name,
        email: user.email,
        number: user.phone,
      },
      orderDetails: {
        totalCharges: totalPrice,
        itemCharges: item.price * quantity,
        deliveryCharges: deliveryCharge,
        estimatedDeliveryTime: duration,
      },
      newOrder,
    };
    return res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to create order");
  }
};
const createOrderAllItems = async (req, res) => {
  try {
    const products = req.body;
    if (!products)
      return res.status(400).json({ message: "NOTHING IN CART TO ORDER" });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "USER NOT FOUND" });
    const distance = req.distance;
    const duration = req.duration;
    const deliveryCharge = req.deliveryCharges;
    if (distance > 30000)
      return res.status(400).json({ message: "NOT AVAILABLE IN YOUR REGION" });
    let totalPrice = products.reduce((acc,product)=>{return acc + product.price*product.productQuantity},0) + deliveryCharge
    const totalInPaise = totalPrice * 100;
    let instance = new razorpay({
      key_id: process.env.RAZORPAYID,
      key_secret: process.env.RAZORPAYSECRET,
    });
    const newOrder = await instance.orders.create({
      amount: totalInPaise,
      currency: "INR",
      notes: { description: "Grocify Shopping" },
    });
    const responseObject = {
      userDetails: {
        name: user.name,
        email: user.email,
        number: user.phone,
      },
      orderDetails: {
        totalCharges: totalPrice,
        itemCharges: totalPrice-deliveryCharge,
        deliveryCharges: deliveryCharge,
        estimatedDeliveryTime: duration,
      },
      newOrder,
    };
    return res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to create order");
  }
};
const addToOrder = async (req, res) => {
  const {
    orderedItems,
    paymentId,
    paymentDate,
    paymentAmount,
    orderId,
    deliveryCharge,
    estimatedDeliveryTime,
  } = req.body;
  console.log(orderedItems)
  if (!orderedItems)
    return res.status(404).json({ message: "NO ITEMS ORDERED" });
  if (!orderId) return res.status(404).json({ message: "ORDER ID NOT FOUND" });
  if (!paymentId || !paymentDate || !paymentAmount)
    return res.status(404).json({ message: "PAYMENT DETAILS NOT AVAILABLE" });
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "USER NOT FOUND" });
  let order = [];
await orderedItems.forEach((item) => {
  let { productId, productName, productQuantity, productImage } = item;
  order.push({ productId, productName, productQuantity, productImage });
});
  console.log(order)
  let orderDetails = {
    orderedItems: order,
    deliverStatus: "Packaging",
    estimatedTime: estimatedDeliveryTime,
    payment: {
      orderId: orderId,
      transactionId: paymentId,
      paymentDate: paymentDate,
      paymentAmount: paymentAmount,
      deliveryCharge: deliveryCharge,
    },
  };
  const createOrder = await Orders.create(orderDetails);
  let addOrderToUser = {
    orderId: createOrder._id,
  };
  user.orders.push(addOrderToUser);
  await user.save();
  return res
    .status(200)
    .json({ message: "Order Added", order: createOrder, user: user });
};
const fetchOrders = async (req, res) => {
  const userId = req.user._id;
  if (!userId) return res.status(404).json({ message: "USER ID NOT FOUND" });
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "USER NOT FOUND" });
  let orders = await Promise.all(
    user.orders.map(async (order) => {
      return await Orders.findById(order.orderId);
    })
  );
  if (!orders) return res.status(404).json({ message: "NO ORDERS TO SHOW" });
  return res
    .status(200)
    .json({ message: "ORDER FETCHED", orderDetails: orders });
};
export { createOrderSingleItem, addToOrder, fetchOrders, createOrderAllItems };
