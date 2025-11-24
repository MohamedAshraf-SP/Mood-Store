import express from "express";
import {
    getOrder,
    searchOrders,
    getCount
} from "../../controllers/orders/orders.js";
import {
    createUnifiedOrder,
    confirmUnifiedOrder,
    trackUnifiedOrder,
    cancelUnifiedOrder,
    printUnifiedOrder,
    getAllUnifiedOrders
} from "../../controllers/orders/unifiedOrders.js";
import { authMiddleware, roleMiddleware } from "../../middlewares/autherization.js";

export const ordersRouter = express.Router();

// Public route - Track order (works with any provider)
ordersRouter.get("/track/:id", trackUnifiedOrder);

// Protected routes - require authentication
ordersRouter.use(authMiddleware, roleMiddleware(["admin", "user"]));

// Get all orders with optional provider filter
ordersRouter.get("/", getAllUnifiedOrders);

// Get counts
ordersRouter.get("/counts", getCount);

// Search orders
ordersRouter.post("/search", searchOrders);

// Create new order (automatically routes to correct provider)
ordersRouter.post("/create", createUnifiedOrder);

// Confirm order (automatically routes to correct provider)
ordersRouter.post("/confirm/:id", confirmUnifiedOrder);

// Print order (J&T only)
ordersRouter.post("/print/:id", printUnifiedOrder);

// Cancel order (works with any provider)
ordersRouter.delete("/cancel/:id", cancelUnifiedOrder);

// Get specific order
ordersRouter.get("/:id", getOrder);

export default ordersRouter;
