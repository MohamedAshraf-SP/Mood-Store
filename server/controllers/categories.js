import { Category } from "../models/categories.js";
import { Product } from "../models/products.js";

const addCategory = async (req, res) => {
    try {
        const data = {
            ...req.body,
            icon: { url: req.files.icon[0].path, alt: req.body.name || "Category icon" },
            image: { url: req.files.image[0].path, alt: req.body.name || "Category image" }
        }




        const newCategory = new Category(data);
        await newCategory.save();
        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate("category", "name");
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate("category", "name");
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const data = { ...req.body }

        if (req.files && req.files.icon) {
            data.icon = { url: req.files.icon[0].path, alt: req.body.name || "Category icon" };
        }
        if (req.files && req.files.image) {
            data.image = { url: req.files.image[0].path, alt: req.body.name || "Category image" };
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { ...data },
            { new: true }
        );
        if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {


        const checkProducts = await Product.findOne({ category: req.params.id, isDeleted: false });
        const checkCategories = await Category.findOne({ category: { "$in": [`${req.params.id}`] } });

        console.log(checkCategories, checkProducts);

        if (checkCategories || checkProducts) return res.status(404).json({ message: "cant delete category associated with another Category or product" });

        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { addCategory, getCategories, getCategoryById, updateCategory, deleteCategory };
