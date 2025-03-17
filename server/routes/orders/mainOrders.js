import express from "express";
import {
    getOrder,
    searchOrders,
    getCount
} from "../../controllers/orders/orders.js";
import { authMiddleware, roleMiddleware } from "../../middlewares/autherization.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const ordersRouter = express.Router();


ordersRouter.get("/counts", authMiddleware, roleMiddleware(["admin", "user"]), getCount);
ordersRouter.post("/search", authMiddleware, roleMiddleware(["admin", "user"]), searchOrders);
ordersRouter.get("/:id", authMiddleware, roleMiddleware(["admin", "user"]), getOrder);



export default ordersRouter;
