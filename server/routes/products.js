import express from "express";
import {
    getProductById,
    getProducts,
    updateProduct,
    deleteProduct,
    addProduct,
} from "../controllers/products.js";
import { upload } from "../middlewares/multer.js";
import reviewsRouter from "./productReviews.js";
import variantsRouter from "./productVariants.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const productsRoute = express.Router();

const uploadFields = upload.fields([
    { name: "mainImage", maxCount: 1 }, // Accepts 1 file for mainImage
    { name: "images", maxCount: 10 }, // Accepts up to 5 files for images
]);



productsRoute.get("/:id", getProductById);
productsRoute.get("/", getProducts);
productsRoute.post("/", uploadFields, addProduct);
productsRoute.put("/:id", uploadFields, updateProduct);
productsRoute.delete("/:id", deleteProduct);

productsRoute.use("/", reviewsRouter);

productsRoute.use("/", variantsRouter);
export default productsRoute;
