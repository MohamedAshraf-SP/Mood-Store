import { Product } from "./../models/products.js";
import { generateBarcode } from "../utils/generators/generators.js";
import { Category } from "../models/categories.js";


export const addProduct = async (req, res) => {
    try {
        const Cat = await Category.findById(req.body.category)
        if(!Cat){
            return res.status(400).json({ error: "برجاء اختيار تصنيف صحيح" });
        }


        const variants = req.body.variants ? req.body.variants.map((variant) => ({
            barCode: generateBarcode(),
            size: variant.size,
            color: variant.color,
            stock: variant.stock,

        })) : [{
            barCode: generateBarcode(),
            price: 1,
            size: "لايوجد",
            color: "لايوجد",
            stock: 0

        }]

        //  console.log(variants);
        console.log(req.files.mainImage);


        if (!req.files) return res.status(400).json({ error: "error" });


        const images = req.files ? req.files.images.map(image => ({ url: image.path, alt: req.body.name || "product picture" })) : [];


        const productData = {
            ...req.body,
            mainImage: { url: req.files.mainImage[0].path, alt: req.body.name || "product picture" },
            images,
            variants
        };


        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        if (error.code === 11000) {
            // MongoDB duplicate key error
            return res.status(400).json({ message: "Barcode must be unique!" });
        }
        res.status(400).json({ error: error.message });
    }
}


export const getProducts = async (req, res) => {
    try {
        let { category, minPrice, maxPrice, isFeatured, sort, page, limit } = req.query;
        let query = { isDeleted: false };
        //  console.log(minPrice);

        if (category) query.category = category;
        if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
        if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
        if (isFeatured) query.isFeatured = isFeatured === "true";

        page = Number(page) || 1;
        limit = Number(limit) || 10;
        const skip = (page - 1) * limit;

        const sortQuery = sort ? { [sort]: 1 } : { createdAt: -1 };

        const products = await Product.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getProductById = async (req, res) => {
    try {
        console.log(req.params.id);
        const product = await Product.findById(req.params.id)//.populate("category");
        if (!product || product.isDeleted) return res.status(404).json({ message: "المنتج غير موجود." });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateProduct = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id)
        const images = req.files ? req.files.map(image => ({ url: image.path, alt: req.body.name || "product picture" })) : []
        console.log(images, req.files);
        if (images.length > 0) {
            console.log("there is no images", images);
            product.images = images
        }


        Object.assign(product, req.body);
        await product.save();

        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!product) return res.status(404).json({ message: "المنتج غير موجود." });
        res.json({ message: "Product deleted (soft delete)", product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateStockByBarcode = async (req, res) => {
    try {
        const { barcode, quantity, operation } = req.body;

        const product = await Product.findOne({ "variants.barcode": barcode });

        if (!product) {
            return res.status(404).json({ message: "Variant not found" });
        }

        const variant = product.variants.find(v => v.barcode === barcode);
        if (operation == "add") {
            variant.stock += quantity;
        } else if (operation == "delete") {
            variant.stock -= quantity;
        }


        await product.save();

        res.status(200).json({ message: "Stock updated successfully", variant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


















// **** Hard Delete a Product (Permanently Remove)*****
// export const deleteProduct = async (req, res) => {
//     try {
//         const product = await Product.findByIdAndDelete(req.params.id);
//         if (!product) return res.status(404).json({ message: "المنتج غير موجود." });
//         res.json({ message: "Product permanently deleted" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
