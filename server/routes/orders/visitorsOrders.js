import express from "express";
import {
   
    getAllVisitorsOrders,
    updateVisitorsOrder,
    deleteVisitorsOrder,
    addVisitorsOrder,
} from "../../controllers/orders/visitorsOrders.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const visitorsOrdersRoute = express.Router();


visitorsOrdersRoute.get("/", getAllVisitorsOrders);
visitorsOrdersRoute.post("/", addVisitorsOrder);
visitorsOrdersRoute.put("/:id", updateVisitorsOrder);
visitorsOrdersRoute.delete("/:id", deleteVisitorsOrder);


export default visitorsOrdersRoute;
