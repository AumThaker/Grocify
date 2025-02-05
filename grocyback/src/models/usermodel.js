import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      housenumber: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "GrocyAPI",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    orders: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
      },
    ],
    loginToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next();
});
userSchema.methods.ComparePassword = async function(password){
  let result = await bcrypt.compare(password, this.password);
  return result;
};
userSchema.methods.genLoginToken = async function(){
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
};
const User = mongoose.model("User", userSchema);
export default User;
