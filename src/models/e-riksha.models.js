import mongoose from "mongoose"
import bcrypt from "bcrypt"

const e_rikshaSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true,
    },
    dlNumber: {
        type: String,
        required: true,
        unique: true,
        // match: [/^[A-Z]{2}\d{2}/, "DL number must start with 2 letters followed by 2 digits (e.g., UP32...)"]
    },
    aadharNo: {
        type: String,
        required: true,
        unique: true,
        // match: [/^[A-Z]{2}\d{2}/, "Licence must start with 2 letters, 2 digits (e.g., UP32...)"]
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true,
        // match: [/^[6-9]\d{9}$/, "Phone number must start with 6-9 and be 10 digits long"],
    },
    document: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    }],


}, {timestamps: true});



export  const Eriksha = mongoose.model("Eriksha", e_rikshaSchema);