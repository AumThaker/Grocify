import mongoose from "mongoose"

const connectDB = async () =>{
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_LINK}/GrocyData`)
        console.log("MONGO DB CONNECTED WITH : ",connection.connection.host)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
export default connectDB;