import Order from "../../models/orders.js"; // Import the order model
import { generateJTCancelRequestBody, generateJTCreateRequestBody, OrderRequest } from "../../services/APIs/JT_API.js";




// Get all orders
export const getAllVisitorsOrders = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query; // Default values
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const orders = await Order.find({ confirmed: 0, deleted: 0 })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments({ confirmed: 0 });

        res.status(200).json({
            totalOrders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            orders,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};


// Add a new order
export const addVisitorsOrder = async (req, res) => {
    try {

        const orderData = generateJTCreateRequestBody(req.body, req.body.items)
        const newOrder = await new Order(orderData).save()

        console.log(newOrder);
        res.status(201).json(newOrder)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a order by ID
export const deleteVisitorsOrder = async (req, res) => {
    try {
        const result = await Order.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "order not found" });
        }
        res.status(200).json({ message: "order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a order by ID
export const updateVisitorsOrder = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you use ID to find the order
        const updatedOrder = await Order.findOneAndUpdate(({ _id: id, deleted: "0", confirmed: "0" }), req.body, {
            new: true,
        });

        if (!updatedOrder) {
            return res.status(404).json({ message: "order not found" });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getCount = async (req, res) => {
    try {
        const counts = {
            unconfirmedOrders: await Order.countDocuments({ deleted: "0", confirmed: "0" }),
            confirmedOrders: await Order.countDocuments({ deleted: "0", confirmed: "1" }),

        }

        res.status(200).json({ counts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};