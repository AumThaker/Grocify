import mongoose from "mongoose";
const GrocySchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['vegetable', 'fruit'], required: true },
    price: { type: Number, required: true }, 
    unit: { type: String, enum: ['kg', 'piece','bunch'], required: true }, 
    stock: { type: Number , required: true }, 
    description: { type: String }, 
    imageUrl: { type: String }, 
},{timestamps:true});
const GrocyAPI = mongoose.model("GrocyAPI",GrocySchema)
export default GrocyAPI