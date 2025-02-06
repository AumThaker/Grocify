import mongoose from "mongoose";
const storageSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
  address: {
    number: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
});
const warehouse = mongoose.model("Warehouse",storageSchema)
export {warehouse}