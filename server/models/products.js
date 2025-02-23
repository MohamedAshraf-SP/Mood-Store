import mongoose, { model } from "mongoose";

const variantSchema = new mongoose.Schema({
    barCode: { type: String, required: true,unique:true, trim: true },
    size: {
        type: String, validate: {
            validator: function (size) {
                return size < 1; // Ensure at least one variant exists
            },
            message: "Size cant be less than 1",
        }
    },
    color: { type: String },
    stock: {
        type: Number, required: true, min: 0,
        validate: {
            validator: function (stock) {
                return stock <= 0; // Ensure at least one variant exists
            },
            message: "no Stock of this item",
        }
    },
    price: {
        type: Number, required: true, default: 0,
        validate: {
            validator: function (price) {
                return price < 1; // Ensure at least one variant exists
            },
            message: "Price cant be less than 1",
        }
    }
})

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    imagePath: { type: String, required: true },
})


const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    barCode: { type: String, required: true, trim: true },
    urlName: { type: String },      // required: true, trim: true},
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },//,required: true
    brand: { type: String, required: true },
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
            message: "Each product must have at least one variant.",
        }
    },
    tags: [
        { name: { type: String } }
    ],
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    reviews: [
        {
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    isFeatured: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
},
    { timestamps: true });





productSchema.virtual("sumStocks").get(function () {
    return this.variants.reduce((total, variant) => total + variant.stock, 0);
});

// Pre-save middleware to recalculate stock before saving
productSchema.pre("save", function (next) {
    this.stock = this.variants.reduce((total, variant) => total + variant.stock, 0);
    next();
});



export const Product = mongoose.model('Product', productSchema);
export const Category = mongoose.model('Category', categorySchema);
export const ProductVariants = mongoose.model('ProductVariants', variantSchema);
