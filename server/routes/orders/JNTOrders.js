import express from "express";
import {
    getOrder
} from "../../controllers/orders/visitorsOrders.js";
import {
trackOrder,
    getJNTOrders,
    confirmJNTOrder,
    cancelJNTOrder,
    addJNTOrder,
    printJNTOrder,
} from "../../controllers/orders/JNTOrders.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const JNTOrdersRoute = express.Router();


JNTOrdersRoute.get("/track/:id", trackOrder);
JNTOrdersRoute.get("/", getJNTOrders);
JNTOrdersRoute.get("/:id", getOrder);
JNTOrdersRoute.post("/print/:id", printJNTOrder);
JNTOrdersRoute.post("/", addJNTOrder);
JNTOrdersRoute.post("/:id", confirmJNTOrder);
JNTOrdersRoute.delete("/:id", cancelJNTOrder);
//JNTOrdersRoute.put("/:id", updateJNTOrder);


export default JNTOrdersRoute;
