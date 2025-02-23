import Product from "./../models/products.js";


export const addProduct = async (req, res) => {
    try {

        if (!req.files) return res.status(400).json({ error: "error" });

        const images = req.files ? req.files.map(image => ({ url: image.path, alt: req.body.name||"product picture" })) : [];

        const productData = {
            ...req.body,
            images
        };

        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ✅ Get All Products (with Filters, Sort, and Pagination)
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

        res.status(200).json({products});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get a Single Product by ID
export const getProductById = async (req, res) => {
    try {
        console.log(req.params.id);
        const product = await Product.findById(req.params.id)//.populate("category");
        if (!product || product.isDeleted) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update a Product by ID (with Optional Image Upload)
export const updateProduct = async (req, res) => {

    try{
    const product = await Product.findById(req.params.id)
    const images = req.files? req.files.map(image => ({ url: image.path, alt: req.body.name||"product picture" })):[]
    console.log(images,req.files);
    if(images.length>0){
        console.log("there is no images",images);
        product.images=images
    }

   
            Object.assign(product, req.body);
            await product.save();

            res.json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
   
};

// ✅ Soft Delete a Product (Mark isDeleted: true)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted (soft delete)", product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// // ✅ Hard Delete a Product (Permanently Remove)
// export const deleteProduct = async (req, res) => {
//     try {
//         const product = await Product.findByIdAndDelete(req.params.id);
//         if (!product) return res.status(404).json({ message: "Product not found" });
//         res.json({ message: "Product permanently deleted" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
