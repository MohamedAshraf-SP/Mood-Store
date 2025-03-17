import express from "express";
import { addStock, addVariant, decreaseStock, deleteVariant, getVariants, updateVariant } from "../controllers/productVariants.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";



const variantsRouter = express.Router();

variantsRouter.post("/:id/variants", addVariant);
variantsRouter.get("/:id/variants", getVariants);
variantsRouter.put("/:productId/variants/:variantId", roleMiddleware(["admin"]), updateVariant);
variantsRouter.delete("/:productId/variants/:variantId", roleMiddleware(["admin"]), deleteVariant);

variantsRouter.patch("/variants/:barCode/add-stock", authMiddleware, roleMiddleware(["admin", "user"]), addStock); // Add stock (default 1)
variantsRouter.patch("/variants/:barCode/decrease-stock", authMiddleware, roleMiddleware(["admin", "user"]), decreaseStock);


export default variantsRouter;
