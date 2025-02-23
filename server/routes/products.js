import express from "express";
import {
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
  addProduct,
} from "../controllers/products.js";
import { upload } from "../middlewares/multer.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const productsRoute = express.Router();



productsRoute.get("/:id", getProductById);
productsRoute.get("/", getProducts);
productsRoute.post("/",upload.array("images",10), addProduct);
productsRoute.put("/:id",upload.array("images",10), updateProduct);
productsRoute.delete("/:id", deleteProduct);


export default productsRoute;
