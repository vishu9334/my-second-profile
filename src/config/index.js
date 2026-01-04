import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\n Mongodb connected !! DB host: ${connection.connection.host}`)
    } catch (e) {
        console.log("Mongodb connection failed", e)
        process.exit(1)
    }
}
export default connectDB

