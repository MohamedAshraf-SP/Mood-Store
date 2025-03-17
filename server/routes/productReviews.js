import express from "express";
import { addReview, getReviews, updateReview, deleteReview } from "../controllers/productReviews.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:id/reviews", addReview);
reviewsRouter.get("/:id/reviews", getReviews);
reviewsRouter.put("/:productId/reviews/:reviewId",authMiddleware, roleMiddleware(["admin"]), updateReview);
reviewsRouter.delete("/:productId/reviews/:reviewId",authMiddleware, roleMiddleware(["admin"]), deleteReview);

export default reviewsRouter;
