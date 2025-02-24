
import { Product } from "./../models/products.js";
/** 
 * @desc   Add a review to a product
 * @route  POST /api/products/:id/reviews
 */
export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "منتج غير موجود" });

        const newReview = { rating, comment };
        product.reviews.push(newReview);

        // Update the average rating and count
        const totalReviews = product.reviews.length;
        const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        product.ratings.average = totalRating / totalReviews;
        product.ratings.count = totalReviews;

        await product.save();
        res.status(201).json({ message: "Review added successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/** 
 * @desc   Get all reviews for a product
 * @route  GET /api/products/:id/reviews
 */
export const getReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select("reviews");
        if (!product) return res.status(404).json({ message: "منتج غير موجود" });

        res.status(200).json(product.reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/** 
 * @desc   Update a review
 * @route  PUT /api/products/:productId/reviews/:reviewId
 */
export const updateReview = async (req, res) => {
    try {
        const { productId, reviewId } = req.params;
        const { rating, comment } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "منتج غير موجود" });

        const review = product.reviews.id(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        review.rating = rating ?? review.rating;
        review.comment = comment ?? review.comment;

        // Recalculate average rating
        const totalReviews = product.reviews.length;
        const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        product.ratings.average = totalRating / totalReviews;
        product.ratings.count = totalReviews;

        await product.save();
        res.status(200).json({ message: "Review updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/** 
 * @desc   Delete a review
 * @route  DELETE /api/products/:productId/reviews/:reviewId
 */
export const deleteReview = async (req, res) => {
    try {
        const { productId, reviewId } = req.params;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "منتج غير موجود" });

        product.reviews = product.reviews.filter(review => review._id.toString() !== reviewId);

        // Recalculate average rating
        const totalReviews = product.reviews.length;
        const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        product.ratings.average = totalReviews ? totalRating / totalReviews : 0;
        product.ratings.count = totalReviews;

        await product.save();
        res.status(200).json({ message: "Review deleted successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
