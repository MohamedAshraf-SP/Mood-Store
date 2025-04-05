import mongoose, { model } from "mongoose";
import { Category } from "./categories.js";

const variantSchema = new mongoose.Schema({
    barCode: { type: String, required: true, unique: true, trim: true },
    size: {
        type: String,
    },
    color: { type: String },
    stock: {
        type: Number, required: true, min: 0,
        validate: {
            validator: function (stock) {
                return stock >= 0; // Ensure at least one variant exists
            },
            message: "لا يوجد عناصر بالمخزون بهذا المنتج",
        }
    },
    totalWithdraw: { type: Number, default: 0 },
    dayWithdraw: { type: Number, default: 0 },
})

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    urlName: { type: String },
    mainImage: { url: { type: String, required: true }, alt: { type: String } },     // required: true, trim: true},
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },//,required: true
    brand: { type: String },
    badge: String,
    price: {
        type: Number, required: true, default: 0,
        validate: {
            validator: function (price) {
                return (price > 1 && price < 999999)// Ensure at least one variant exists
            },
            message: "\nلا يمكن ان يكون السعر اقل من1 و اكثر من999999 \n",
        }
    },
    discount: { type: Number, required: true, default: 0 },
    actualPrice: { type: Number, required: true, default: 0 },

    // stock: { type: Number, required: true, min: 0 },
    images: [
        { url: { type: String, required: true }, alt: { type: String } }
    ],
    variants: {
        type: [
            variantSchema
        ],
        validate: {
            validator: function (variants) {
                return variants.length > 0; // Ensure at least one variant exists
            },
            message: "كل منتج يجب ان يحتوي علي خيار واحد علي الاقل",
        }
    },
    tags: [
        { type: String }
    ],
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    reviews: [
        {
            name: { type: String },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    soldCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
},
    { timestamps: true });







productSchema.pre("save", function (next) {
    this.actualPrice = Math.ceil(this.price - (this.discount / 100 * this.price));
    next();
});

productSchema.virtual("sumStocks").get(function () {
    return this.variants.reduce((total, variant) => total + variant.stock, 0);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });


// productSchema.virtual("actualPrice").get(function () {
//     return (this.price + (this.price * this.discout / 100));
// });

// Pre-save middleware to recalculate stock before saving
productSchema.pre("save", function (next) {
    this.stock = this.variants.reduce((total, variant) => total + variant.stock, 0);
    next();
});



export const Product = mongoose.model('Product', productSchema);

export const ProductVariants = mongoose.model('ProductVariants', variantSchema);
