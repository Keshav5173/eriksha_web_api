import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const documentSchema = mongoose.Schema({
    Name: {
        type: String,
        default: ["Aadhar Card", "Licence Card", "Vehicle Document"]
    },
    documentFile: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Eriksha"
    }
})

documentSchema.plugin(mongooseAggregatePaginate);

export const Document = mongoose.model("Document",documentSchema); 