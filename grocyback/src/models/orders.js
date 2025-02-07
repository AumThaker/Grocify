import mongoose from "mongoose";
const order = mongoose.Schema({
  orderedItems:[{
    productId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    productName:{
      type:String,
      required:true
    },
    productQuantity:{
      type:String,
      required:true
    }
  }],
  deliverStatus:{
      type:String,
      enum: ['Packaging', 'Delivering','Delivered'],
      required:true
  },
  estimatedTime:{
    type:String,
    required:true
  },
  payment:
    {
      orderId:{
        type:String,
        required:true
      },
      transactionId: {
        type: String,
        required: true,
      },
      paymentDate: {
        type: Date,
        required: true,
      },
      paymentAmount: {
        type: Number,
        required: true,
      },
      deliveryCharge:{
        type:Number,
        required:true
      },

    },
});

const Orders = mongoose.model("Order",order);
export default Orders