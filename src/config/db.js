import mongoose from "mongoose";

export const connectDb = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB connected! Host: ${connectionInstance.connection.host}`);
    }catch(err){
            console.log("Error occured in connecting to mongodb database", err);
            process.exit();
        }
}