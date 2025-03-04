import express from "express";
import {
    getOrder,
    searchOrders,
    getCount
} from "../../controllers/orders/orders.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const ordersRouter = express.Router();


ordersRouter.get("/counts", getCount);
ordersRouter.post("/search", searchOrders);
ordersRouter.get("/:id", getOrder);



export default ordersRouter;
