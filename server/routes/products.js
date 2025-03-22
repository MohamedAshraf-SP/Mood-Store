import express from "express";
import {
    getProductById,
    getProducts,
    updateProduct,
    deleteProduct,
    addProduct,
    getCount,
    searchVariants,
} from "../controllers/products.js";
import { upload } from "../middlewares/multer.js";
import reviewsRouter from "./productReviews.js";
import variantsRouter from "./productVariants.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";
import { resizeImageMiddleware, resizeImagesMiddleware } from "../middlewares/sharp.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const productsRoute = express.Router();

const uploadFields = upload.fields([
    { name: "mainImage", maxCount: 1 }, // Accepts 1 file for mainImage
    { name: "images", maxCount: 10 }, // Accepts up to 5 files for images
]);



productsRoute.get("/counts", getCount);
productsRoute.get("/search", searchVariants);
productsRoute.get("/:id", getProductById);
productsRoute.get("/", getProducts);

productsRoute.post("/", authMiddleware, roleMiddleware(["admin"]), uploadFields, addProduct);
productsRoute.put("/:id", authMiddleware, roleMiddleware(["admin"]), uploadFields, updateProduct);
productsRoute.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteProduct);

productsRoute.use("/", reviewsRouter);

productsRoute.use("/", variantsRouter);
export default productsRoute;
