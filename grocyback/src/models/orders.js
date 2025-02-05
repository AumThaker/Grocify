import mongoose from "mongoose";
const order = mongoose.Schema({
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  payment: [
    {
      transactionId: {
        type: String,
        required: true,
      },
      paymentAmount: {
        type: Number,
        required: true,
      },
      paymentDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

const Orders = mongoose.model("Order",order);
export default Orders