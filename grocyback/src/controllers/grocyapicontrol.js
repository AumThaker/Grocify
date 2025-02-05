import GrocyAPI from "/aum/Internship/grocyback/src/models/grocymodel.js";
const GrocyAdd = async (req,res) => {
    try {
        const {name,category,price,unit,stock,description,imageUrl} = req.body;
        const newGrocery = await GrocyAPI.create({ name, category, price, unit, stock, description, imageUrl });
        await newGrocery.save();
        return res.status(201).json(newGrocery);
    } catch (error) {
        return res.status(500).json({error:error.message,status:"FAILED"});
    }
}
const GrocyUpdateStock = async (req,res) => {
    try {
        const {stock} = req.body;
        const grocy = await GrocyAPI.findById(item._id);
        grocy.stock = stock;
        await grocy.save();
        return res.status(200).json("Stock changed");
    } catch (error) {
        return res.status(500).json("Stock not changed");
    }
}
const GrocyVegAllInfo = async (req,res)=>{
    try {
        const vegetables = await GrocyAPI.find({category: "vegetable"});
        if(!vegetables) return res.status(400).json("No vegetables found");
        return res.status(200).json(vegetables);
    } catch (error) {
        return res.status(500).json({error:error.message,status:"FAILED"});
    }
}
const GrocyFruitAllInfo = async (req,res)=>{
    try {
        const fruits = await GrocyAPI.find({category: "fruit"});
        if(!fruits) return res.status(400).json("No fruits found");
        return res.status(200).json(fruits);
    } catch (error) {
        return res.status(500).json({error:error.message,status:"FAILED"});
    }
}
export {GrocyAdd,GrocyUpdateStock,GrocyVegAllInfo,GrocyFruitAllInfo}