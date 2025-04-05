import { Product } from "../models/products.js"; // Import the Product model
import { generateBarcode } from "../utils/generators/generators.js";

// ✅ Add a new variant to a product
export const addVariant = async (req, res) => {
    try {


        const { id } = req.params; // Product ID from URL
        const { size, color, stock } = req.body;

        const barCode = generateBarcode()

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const newVariant = { barCode, size, color, stock };

        // Push new variant to the product's variants array
        product.variants.push(newVariant);
        await product.save();

        res.status(201).json({ message: "Variant added successfully", variant: newVariant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get all variants of a product
export const getVariants = async (req, res) => {
    try {
        const { id } = req.params; // Product ID from URL
        const product = await Product.findById(id).select("variants");

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json(product.variants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update a variant by variant ID
export const updateVariant = async (req, res) => {
    try {
        const { id, variantId } = req.params; // Product ID & Variant ID from URL
        const { size, color, stock } = req.body; // Updated details

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Find the variant inside the product's variants array
        const variant = product.variants.id(variantId);
        if (!variant) return res.status(404).json({ message: "Variant not found" });

        // Update the variant fields

        if (size) variant.size = size;
        if (color) variant.color = color;
        if (stock !== undefined) variant.stock = stock;

        await product.save();
        res.status(200).json({ message: "Variant updated successfully", variant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete a variant by variant ID
export const deleteVariant = async (req, res) => {
    try {
        const { id, variantId } = req.params; // Product ID & Variant ID from URL

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Filter out the variant to delete it
        product.variants = product.variants.filter(variant => variant._id.toString() !== variantId);

        await product.save();
        res.status(200).json({ message: "Variant deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ✅ Add Stock by barCode (default: +1)
export const addStock = async (req, res) => {
    try {

        const { barCode } = req.params;
        //console.log(barCode)

        // Find the product that contains this variant
        const product = await Product.findOne({ "variants.barCode": barCode });

        if (!product) {
            return res.status(404).json({ message: "Variant not found" });
        }

        // Find the specific variant and update stock
        const variant = product.variants.find(v => v.barCode === barCode);
        variant.stock += 1;





        await product.save();

        let responseVariant = {
            ...variant.toObject(),
            name: product.name,
            price: product.price
        }

        res.status(200).json({ message: "Stock increased successfully", responseVariant });

    } catch (error) {
        res.status(500).json({ message: "Error updating stock", err: error.message });
    }
};

// ✅ Decrease Stock by barCode (if stock > 0)
export const decreaseStock = async (req, res) => {
    try {
        const { barCode } = req.params;

        // Find the product that contains this variant
        const product = await Product.findOne({ "variants.barCode": barCode });

        if (!product) {
            return res.status(404).json({ message: "Variant not found" });
        }

        // Find the specific variant
        const variant = product.variants.find(v => v.barCode === barCode);

        if (variant.stock > 0) {
            variant.stock -= 1;
            variant.dayWithdraw += 1;
            variant.totalWithdraw += 1;
            product.soldCount += 1; // Increment sold count
            // Update the product's sold count if needed

            await product.save();


            let responseVariant = {
                ...variant.toObject(),
                name: product.name,
                price: product.price
            }

            res.status(200).json({ message: "Stock decreased successfully", responseVariant });
        } else {
            res.status(400).json({ message: "Stock is already 0, cannot decrease further" });
        }

    } catch (error) {
        res.status(500).json({ message: `${error.message}` });
    }
};

