import mongoose from "mongoose"

const unique_erikshaSchema = mongoose.Schema({
    vechicleNumber: {
        type: String,
        required: true, 
        unique: true,
        toUpperCase: true
    },
    vechicleOwner:{
        type: String,
        required: true,
        unique: true,
        toUpperCase: true,
    }
},{timestamps: true});


export const unique_eriksha = mongoose.model("Unique_eriksha", unique_erikshaSchema);