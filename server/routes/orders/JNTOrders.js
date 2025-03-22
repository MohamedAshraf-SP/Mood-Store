import express from "express";

import {
    trackOrder,
    getJNTOrders,
    confirmJNTOrder,
    cancelJNTOrder,
    addJNTOrder,
    printJNTOrder,
    printManyJNTOrder

} from "../../controllers/orders/JNTOrders.js";
import { authMiddleware, roleMiddleware } from "../../middlewares/autherization.js";
export const JNTOrdersRoute = express.Router();

//JNTOrdersRoute.use(authMiddleware)
JNTOrdersRoute.use(authMiddleware, roleMiddleware(["admin", "user"]))

JNTOrdersRoute.get("/track/:id", trackOrder);
JNTOrdersRoute.get("/", getJNTOrders);
JNTOrdersRoute.post("/print/all", printManyJNTOrder);
JNTOrdersRoute.post("/print/:id", printJNTOrder);
JNTOrdersRoute.post("/", addJNTOrder);
JNTOrdersRoute.post("/:id", confirmJNTOrder);
JNTOrdersRoute.delete("/:id", cancelJNTOrder);
//JNTOrdersRoute.put("/:id", updateJNTOrder);


export default JNTOrdersRoute;
