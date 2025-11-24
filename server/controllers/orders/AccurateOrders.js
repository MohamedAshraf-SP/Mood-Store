import Order from "../../models/orders.js";
import {
    authenticateAccurate,
    saveShipment,
    getShipment,
    listShipments,
    calculateShipmentFees,
    cancelShipment,
    generateAccurateShipmentData
} from "../../services/APIs/Accurate_API.js";
import mongoose from "mongoose";

/**
 * Get all Accurate orders with pagination
 */
export const getAccurateOrders = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const orders = await Order.find({
            confirmed: "1",
            deleted: "0",
            shippingProvider: "ACCURATE"
        })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments({
            confirmed: "1",
            deleted: "0",
            shippingProvider: "ACCURATE"
        });

        res.status(200).json({
            totalOrders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            orders,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Add a new Accurate order
 */
export const addAccurateOrder = async (req, res) => {
    try {
        // Generate order data for local database
        const orderData = {
            ...req.body,
            shippingProvider: 'ACCURATE',
            confirmed: "1"
        };

        // Save to local database first
        const savedOrder = await new Order(orderData).save();

        // Generate Accurate shipment data
        const accurateShipmentData = generateAccurateShipmentData(savedOrder);

        // Create shipment in Accurate API
        const accurateResponse = await saveShipment(accurateShipmentData);

        // Update order with Accurate tracking information
        await Order.findByIdAndUpdate(savedOrder._id, {
            accurateTrackingNumber: accurateResponse.trackingNumber,
            accurateShipmentId: accurateResponse.id,
            accurateStatus: accurateResponse.status,
            accurateShippingFees: accurateResponse.fees?.totalFees || 0
        }, { new: true });

        res.status(201).json({
            message: "Order created successfully in Accurate",
            trackingNumber: accurateResponse.trackingNumber,
            shipmentId: accurateResponse.id,
            status: accurateResponse.status
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Confirm an existing order and create shipment in Accurate
 */
export const confirmAccurateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Find unconfirmed order
        const orderData = await Order.findOne({
            _id: orderId,
            deleted: "0",
            confirmed: "0"
        });

        if (!orderData) {
            return res.status(400).json({
                message: "Order not found or already confirmed"
            });
        }

        // Generate Accurate shipment data
        const accurateShipmentData = generateAccurateShipmentData(orderData);

        // Create shipment in Accurate API
        const accurateResponse = await saveShipment(accurateShipmentData);

        // Update order as confirmed with Accurate tracking info
        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            confirmed: "1",
            shippingProvider: "ACCURATE",
            accurateTrackingNumber: accurateResponse.trackingNumber,
            accurateShipmentId: accurateResponse.id,
            accurateStatus: accurateResponse.status,
            accurateShippingFees: accurateResponse.fees?.totalFees || 0
        }, { new: true });

        res.status(201).json({
            message: "Order confirmed successfully in Accurate",
            order: updatedOrder,
            trackingNumber: accurateResponse.trackingNumber
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Track an Accurate order
 */
export const trackAccurateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Find the order
        const order = await Order.findOne({
            _id: orderId,
            confirmed: "1",
            deleted: "0",
            shippingProvider: "ACCURATE"
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found or not confirmed with Accurate"
            });
        }

        if (!order.accurateTrackingNumber) {
            return res.status(404).json({
                message: "No tracking number found for this order"
            });
        }

        // Get shipment details from Accurate API
        const shipmentDetails = await getShipment(order.accurateTrackingNumber);

        // Update local order status
        await Order.findByIdAndUpdate(orderId, {
            accurateStatus: shipmentDetails.status
        });

        res.status(200).json({
            trackingNumber: shipmentDetails.trackingNumber,
            status: shipmentDetails.status,
            timeline: shipmentDetails.timeline || [],
            shipmentDetails: shipmentDetails
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Cancel an Accurate order
 */
export const cancelAccurateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { reason } = req.body;

        // Find the order
        const order = await Order.findOne({
            _id: orderId,
            deleted: "0",
            shippingProvider: "ACCURATE"
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (!order.accurateTrackingNumber) {
            // If no tracking number, just mark as deleted locally
            await Order.findByIdAndUpdate(orderId, { deleted: "1" });
            return res.status(200).json({
                message: "Order cancelled locally (no shipment created)"
            });
        }

        // Cancel shipment in Accurate API
        const cancelResponse = await cancelShipment(
            order.accurateTrackingNumber,
            reason
        );

        // Mark order as deleted locally
        await Order.findByIdAndUpdate(orderId, {
            deleted: "1",
            accurateStatus: cancelResponse.status
        });

        res.status(200).json({
            message: "Order cancelled successfully in Accurate",
            status: cancelResponse.status
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Calculate shipping fees for an order
 */
export const calculateAccurateShippingFees = async (req, res) => {
    try {
        const { fromZoneId, toZoneId, weight, codAmount, packageCount } = req.body;

        const fees = await calculateShipmentFees({
            fromZoneId,
            toZoneId,
            weight,
            codAmount,
            packageCount
        });

        res.status(200).json({
            fees: fees
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get order by ID
 */
export const getAccurateOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            shippingProvider: "ACCURATE"
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * List shipments from Accurate API with filters
 */
export const listAccurateShipments = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            referenceNumber: req.query.referenceNumber,
            trackingNumber: req.query.trackingNumber,
            receiverPhone: req.query.receiverPhone,
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo,
            page: parseInt(req.query.page) || 1,
            perPage: parseInt(req.query.perPage) || 20
        };

        const shipments = await listShipments(filters);

        res.status(200).json({
            shipments: shipments.data,
            pagination: shipments.paginatorInfo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Sync Accurate shipment status with local order
 */
export const syncAccurateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findOne({
            _id: orderId,
            shippingProvider: "ACCURATE",
            accurateTrackingNumber: { $exists: true }
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found or no tracking number"
            });
        }

        // Get latest shipment details
        const shipmentDetails = await getShipment(order.accurateTrackingNumber);

        // Update local order
        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            accurateStatus: shipmentDetails.status,
            accurateShippingFees: shipmentDetails.fees?.totalFees || order.accurateShippingFees
        }, { new: true });

        res.status(200).json({
            message: "Order status synced successfully",
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Test Accurate API connection
 */
export const testAccurateConnection = async (req, res) => {
    try {
        const token = await authenticateAccurate();
        res.status(200).json({
            message: "Successfully connected to Accurate API",
            authenticated: !!token
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to connect to Accurate API",
            error: error.message
        });
    }
};

export default {
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
};
