import express from "express";
import {
    getCategoryById,
    getCategories,
    updateCategory,
    deleteCategory,
    addCategory,
} from "../controllers/categories.js";
import { upload } from "../middlewares/multer.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const categoriesRoute = express.Router();

const uploadFields = upload.fields([
    { name: "icon", maxCount: 1 }, // Accepts 1 file for mainImage
    { name: "image", maxCount: 1 }, // Accepts up to 5 files for images
]);



categoriesRoute.get("/:id", getCategoryById);
categoriesRoute.get("/", getCategories);
categoriesRoute.post("/", uploadFields, addCategory);
categoriesRoute.put("/:id", uploadFields, updateCategory);
categoriesRoute.delete("/:id", deleteCategory);


export default categoriesRoute;
