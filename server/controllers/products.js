import { Product, ProductVariants } from "./../models/products.js";
import { generateBarcode } from "../utils/generators/generators.js";
import { Category } from "../models/categories.js";
import { deleteFileWithPath } from "../utils/helpers/deleteFile.js";
import { getCountOfSchema } from "../services/general.js";


export const addProduct = async (req, res) => {
    try {
        const Cat = await Category.findById(req.body.category)
        // console.log(req.files);
        if (!Cat) {
            return res.status(400).json({ error: "برجاء اختيار تصنيف صحيح" });
        }

        // if (!req.files) {
        //     return res.status(400).json({ error: "برجاء ارفاق  صور." });
        // }

        const variants = req.body.variants ? req.body.variants.map((variant) => {
            const normalizedVariant = Object.assign({}, variant);
            return {
                barCode: generateBarcode(),
                size: normalizedVariant.size,
                color: normalizedVariant.color,
                stock: normalizedVariant.stock,

            }
        }) : [{
            barCode: generateBarcode(),
            price: 1,
            size: "لايوجد",
            color: "لايوجد",
            stock: 0

        }]

        // console.log(variants);
        /// console.log(req.files.mainImage);


        if (!req.files) return res.status(400).json({ error: "error" });


        const images = req.files ? req.files.images.map(image => {
            const normalizedImage = Object.assign({}, image);
            return { url: normalizedImage.path, alt: req.body.name || "product picture" }
        }) : [];



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


export const searchVariants = async (req, res) => {
    try {
        const { name } = req.query
        let filter = { $or: [] }

        if (name) {
            filter.$or.push({ "name": name })
            filter.$or.push({ "variants.color": name })

        } else {
            filter = {}
        }
        //console.log(filter);
        const products = await Product.aggregate([
            { $unwind: "$variants" },
            { $match: filter },
            {
                $project: {
                    _id: 0,
                    "product": { $concat: ["$name", " ", "$variants.color", " (", "$variants.size", ")"] },
                    "variantId": "$variants._id",
                    "avilable items": "$variants.stock",
                    "barCode": "$variants.barCode",
                    "price": "$actualPrice"

                    // "product": "$name $variants.size $variants.color",

                }
            }
        ])
        res.status(200).json({ products })

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const getProducts = async (req, res) => {
    try {
        let { category, minPrice, maxPrice, isFeatured, sort, sortType, page, limit } = req.query;
        let query = { isDeleted: false };
        //  console.log(minPrice);

        if (category) query.category = category;
        if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
        if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
        if (isFeatured) query.isFeatured = isFeatured === "true";

        page = Number(page) || 1;
        limit = Number(limit) || 10;
        let skip = (page - 1) * limit;
      //  console.log(limit);

        const sortQuery = sort ? { [sort]: (sortType ? Number(sortType) : 1) } : { createdAt: -1 };
        //console.log(sortQuery);
        const products = await Product.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);
        const count = await Product.countDocuments(query)

        if (skip == 0) skip = 1
        const totalPages = Math.ceil(count / limit)

        res.status(200).json({
            "currentPage": page,
            "ProductsCount": count,
            "totalPages": totalPages,
            "Products": products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getProductById = async (req, res) => {
    try {
        // console.log(req.params.id);
        const product = await Product.findById(req.params.id)//.populate("category");
        //console.log(product);

        if (!product || product.isDeleted) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateProduct = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        
        const variants = req.body.variants ? req.body.variants.map((variant) => {
            const normalizedVariant = Object.assign({}, variant);
            return {
                barCode: variant.barCode ? variant.barCode : generateBarcode(),
                size: normalizedVariant.size,
                color: normalizedVariant.color,
                stock: normalizedVariant.stock,

            }
        }) : product.variants

        if (req.body?.removedImagesPaths) {
            // Remove images from the product
            product.images = product.images.filter(image => !req.body.removedImagesPaths.includes(image.url));


            // Delete images from storage (optional)
            req.body.removedImagesPaths.forEach(imagePath => {
               // console.log(deleteFileWithPath(imagePath))
            });
        }

        product.images = req.files?.images ? [...product.images, ...req.files.images.map(image => {
            return { url: image.path, alt: req.body.name || "product picture" }
        })] : [...product.images]

        if (req.files?.mainImage) {
            deleteFileWithPath(product.mainImage.url)
            product.mainImage = req.files.mainImage ?
                { url: req.files.mainImage[0].path, alt: req.body.name || "product picture" } : product.mainImage
        }

        req.body.variants = variants

        Object.assign(product, req.body)
        await product.save();

        res.json(product);
    } catch (error) {
        // console.log(error);
        res.status(400).json({ error: error.message });
    }

};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted", product });
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
export const getCount = async (req, res) => {
    try {
        const counts = {
            acitvePoducts: await Product.countDocuments({ isActive: true }),
            unactivePoducts: await Product.countDocuments({ isActive: false }),
            variants: await ProductVariants.countDocuments()
            // totalStock: await Product.aggregate([
            //     { $unwind: "$variants" }, // Flatten the variants array
            //     { $group: { _id: null, totalStock: { $sum: "$variants.stock" } } }
            // ])
        }

        res.status(200).json({ counts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




















// **** Hard Delete a Product (Permanently Remove)*****
// export const deleteProduct = async (req, res) => {
//     try {
//         const product = await Product.findByIdAndDelete(req.params.id);
//         if (!product) return res.status(404).json({ message: "Product not found" });
//         res.json({ message: "Product permanently deleted" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
