import { warehouse } from "../models/warehousemodel.js"

const addWarehouse = async (req,res)=>{
    const {name,number,street,city,state,pincode} = req.body
    const storage = await warehouse.create({name:name,
        address:{
            number,street,city,state,pincode
        }
    })
    if(!storage) return res.status(404)
    return res.status(200).json({storage})
}
export {addWarehouse}