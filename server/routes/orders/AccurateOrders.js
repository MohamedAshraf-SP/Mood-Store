import express from "express";

import {
    getAccurateOrders,
    addAccurateOrder,
    confirmAccurateOrder,
    trackAccurateOrder,
    cancelAccurateOrder,
    calculateAccurateShippingFees,
    getAccurateOrderById,
    listAccurateShipments,
    syncAccurateOrderStatus,
    testAccurateConnection
} from "../../controllers/orders/AccurateOrders.js";
import { authMiddleware, roleMiddleware } from "../../middlewares/autherization.js";

export const AccurateOrdersRoute = express.Router();

// Public route - Track order
AccurateOrdersRoute.get("/track/:id", trackAccurateOrder);

// Test Accurate API connection (can be public for testing)
AccurateOrdersRoute.get("/test-connection", testAccurateConnection);

// Protected routes - require authentication
AccurateOrdersRoute.use(authMiddleware, roleMiddleware(["admin", "user"]));

// Get all Accurate orders with pagination
AccurateOrdersRoute.get("/", getAccurateOrders);

// Get specific order by ID
AccurateOrdersRoute.get("/:id", getAccurateOrderById);

// Calculate shipping fees
AccurateOrdersRoute.post("/calculate-fees", calculateAccurateShippingFees);

// Add new order
AccurateOrdersRoute.post("/", addAccurateOrder);

// Confirm existing order
AccurateOrdersRoute.post("/:id/confirm", confirmAccurateOrder);

// Sync order status with Accurate API
AccurateOrdersRoute.post("/:id/sync", syncAccurateOrderStatus);

// Cancel order
AccurateOrdersRoute.delete("/:id", cancelAccurateOrder);

// List shipments from Accurate API
AccurateOrdersRoute.get("/shipments/list", listAccurateShipments);

export default AccurateOrdersRoute;
