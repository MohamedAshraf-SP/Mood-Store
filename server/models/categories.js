import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    icon: { url: { type: String, required: true }, alt: { type: String } },
    image:{ url: { type: String, required: true }, alt: { type: String } },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }

})

export const Category = mongoose.model('Category', categorySchema);
