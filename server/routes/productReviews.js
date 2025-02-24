import express from "express";
import { addReview, getReviews, updateReview, deleteReview } from "../controllers/productReviews.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:id/reviews", addReview);
reviewsRouter.get("/:id/reviews", getReviews);
reviewsRouter.put("/:productId/reviews/:reviewId", updateReview);
reviewsRouter.delete("/:productId/reviews/:reviewId", deleteReview);

export default reviewsRouter;
