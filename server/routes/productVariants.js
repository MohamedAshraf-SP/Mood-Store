import express from "express";
import { addStock, addVariant, decreaseStock, deleteVariant, getVariants, updateVariant } from "../controllers/productVariants.js";



const variantsRouter = express.Router();

variantsRouter.post("/:id/variants", addVariant);
variantsRouter.get("/:id/variants", getVariants);
variantsRouter.put("/:productId/variants/:reviewId", updateVariant);
variantsRouter.delete("/:productId/variants/:reviewId", deleteVariant);

variantsRouter.patch("/variants/:barCode/add-stock", addStock); // Add stock (default 1)
variantsRouter.patch("/variants/:barCode/decrease-stock", decreaseStock);


export default variantsRouter;
