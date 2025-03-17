import express from "express";
import {
    getCategoryById,
    getAllCategories,
    getMainCategories,
    getSubCategoriesOfCategory,
    updateCategory,
    deleteCategory,
    addCategory,
    getCount
} from "../controllers/categories.js";
import { upload } from "../middlewares/multer.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";
export const categoriesRoute = express.Router();

const uploadFields = upload.fields([
    { name: "icon", maxCount: 1 }, // Accepts 1 file for mainImage
    { name: "image", maxCount: 1 }, // Accepts up to 5 files for images
]);


categoriesRoute.get("/counts", getCount);
categoriesRoute.get("/main", getMainCategories);
categoriesRoute.get("/:id/subcategories", getSubCategoriesOfCategory);
categoriesRoute.get("/:id", getCategoryById);

categoriesRoute.get("/", getAllCategories);
categoriesRoute.post("/",authMiddleware,roleMiddleware(["admin","user"]), uploadFields, addCategory);
categoriesRoute.put("/:id",authMiddleware,roleMiddleware(["admin","user"]), uploadFields, updateCategory);
categoriesRoute.delete("/:id",authMiddleware,roleMiddleware(["admin","user"]), deleteCategory);


export default categoriesRoute;
