import mongoose from "mongoose";
import User from "../models/usermodel.js";
import GrocyAPI from "/aum/Internship/grocyback/src/models/grocymodel.js";
import razorpay from 'razorpay'
import Orders from "../models/orders.js";

const createOrderSingleItem = async (req, res) => {
  try {
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
const totalInPaise = totalPrice*100
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
      userDetails:{
        name:user.name,
        email:user.email,
        number:user.phone
      },
      orderDetails:{
        totalCharges:totalPrice,
        itemCharges:item.price*quantity,
        deliveryCharges:deliveryCharge,
        estimatedDeliveryTime:duration*60
      },
      newOrder
    }
    return res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to create order");
  }
};

const addToOrder = async (req,res) =>{
  const {orderedItems,paymentId,paymentDate,paymentAmount,orderId,deliveryCharge,estimatedTime} = req.body
  if(!orderedItems) return res.status(404).json({message:"NO ITEMS ORDERED"})
  if(!orderId) return res.status(404).json({message:"ORDER ID NOT FOUND"})
  if(!paymentId || !paymentDate || !paymentAmount) return res.status(404).json({message:"PAYMENT DETAILS NOT AVAILABLE"})
  const user = await User.findById(req.user._id)
  if(!user) return res.status(404).json({message:"USER NOT FOUND"})
    let items = orderedItems.map((item,id)=>{
      let productId = item[0]._id
      let productName = item[0].name
      let productQuantity = item[1]
      const order = {productId,productName,productQuantity}
      return order
  })
  let orderDetails = {
    orderedItems:items,
    deliverStatus:"Packaging",
    estimatedTime:estimatedTime,
    payment:{
      orderId:orderId,
      transactionId:paymentId,
      paymentDate:paymentDate,
    paymentAmount:paymentAmount,
    deliveryCharge:deliveryCharge
    }
  }
  const createOrder = await Orders.create(orderDetails)
  let addOrderToUser = {
    orderId:createOrder._id
  }
  await user.orders.push(addOrderToUser)
  return res.status(200).json({message:"Order Added",order:createOrder,user:user})
}
export { createOrderSingleItem , addToOrder };
