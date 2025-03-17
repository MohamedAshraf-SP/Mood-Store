import express from "express";
import {
   
    getAllVisitorsOrders,
    updateVisitorsOrder,
    deleteVisitorsOrder,
    addVisitorsOrder,
} from "../../controllers/orders/visitorsOrders.js";
import { authMiddleware, roleMiddleware } from "../../middlewares/autherization.js";
export const visitorsOrdersRoute = express.Router();


visitorsOrdersRoute.get("/", getAllVisitorsOrders);
visitorsOrdersRoute.post("/", addVisitorsOrder);
visitorsOrdersRoute.put("/:id",authMiddleware,roleMiddleware(["admin","user"]), updateVisitorsOrder);
visitorsOrdersRoute.delete("/:id",authMiddleware,roleMiddleware(["admin","user"]), deleteVisitorsOrder);


export default visitorsOrdersRoute;
