import Order from "../../models/orders.js";
import {
    generateJTCreateRequestBody,
    generateJTCancelRequestBody,
    generateJTPrintRequestBody,
    generateTrackRequestBody,
    OrderRequest
} from "../../services/APIs/JT_API.js";
import {
    saveShipment,
    getShipment,
    cancelShipment,
    generateAccurateShipmentData
} from "../../services/APIs/Accurate_API.js";

/**
 * Unified endpoint to create order with any shipping provider
 * Detects provider from request body or defaults to JT
 */
export const createUnifiedOrder = async (req, res) => {
    try {
        const shippingProvider = req.body.shippingProvider || 'JT';

        if (shippingProvider === 'ACCURATE') {
            // Use Accurate shipping
            const orderData = {
                ...req.body,
                shippingProvider: 'ACCURATE',
                confirmed: "1"
            };

            const savedOrder = await new Order(orderData).save();
            const accurateShipmentData = generateAccurateShipmentData(savedOrder);
            const accurateResponse = await saveShipment(accurateShipmentData);

            await Order.findByIdAndUpdate(savedOrder._id, {
                accurateTrackingNumber: accurateResponse.trackingNumber,
                accurateShipmentId: accurateResponse.id,
                accurateStatus: accurateResponse.status,
                accurateShippingFees: accurateResponse.fees?.totalFees || 0
            }, { new: true });

            return res.status(201).json({
                message: "Order created successfully with Accurate",
                provider: "ACCURATE",
                trackingNumber: accurateResponse.trackingNumber,
                orderId: savedOrder._id
            });
        } else {
            // Use J&T shipping (default)
            const orderData = generateJTCreateRequestBody(req.body, req.body.items);
            orderData.confirmed = "1";
            orderData.shippingProvider = 'JT';

            const savedOrder = await new Order(orderData).save();
            const requestOrderData = await Order.findById(savedOrder._id)
                .select('-_id -createdAt -updatedAt -__v -items._id -sender._id -receiver._id -billCode')
                .lean();

            const responseOfJT = await OrderRequest('/order/addOrder', requestOrderData);

            if (responseOfJT.data.msg == "success") {
                await Order.findByIdAndUpdate(savedOrder._id, {
                    billCode: responseOfJT.data.data.billCode
                }, { new: true });
            }

            return res.status(201).json({
                message: responseOfJT.data.msg,
                provider: "JT",
                billCode: responseOfJT.data.data?.billCode,
                orderId: savedOrder._id
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Unified endpoint to confirm an existing order with any shipping provider
 */
export const confirmUnifiedOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const shippingProvider = req.body.shippingProvider || 'JT';

        const order = await Order.findOne({
            _id: orderId,
            deleted: "0",
            confirmed: "0"
        });

        if (!order) {
            return res.status(400).json({
                message: "Order not found or already confirmed"
            });
        }

        if (shippingProvider === 'ACCURATE') {
            // Confirm with Accurate
            const accurateShipmentData = generateAccurateShipmentData(order);
            const accurateResponse = await saveShipment(accurateShipmentData);

            const updatedOrder = await Order.findByIdAndUpdate(orderId, {
                confirmed: "1",
                shippingProvider: "ACCURATE",
                accurateTrackingNumber: accurateResponse.trackingNumber,
                accurateShipmentId: accurateResponse.id,
                accurateStatus: accurateResponse.status,
                accurateShippingFees: accurateResponse.fees?.totalFees || 0
            }, { new: true });

            return res.status(201).json({
                message: "Order confirmed successfully with Accurate",
                provider: "ACCURATE",
                trackingNumber: accurateResponse.trackingNumber,
                order: updatedOrder
            });
        } else {
            // Confirm with J&T
            const requestOrderData = await Order.findOne({ _id: orderId, deleted: "0", confirmed: "0" })
                .select('-_id -createdAt -updatedAt -__v -items._id -sender._id -receiver._id -billCode')
                .lean();

            if (!requestOrderData) {
                return res.status(400).json({
                    message: "Order not found or already confirmed"
                });
            }

            const responseOfJT = await OrderRequest('/order/addOrder', requestOrderData);

            if (responseOfJT.data.msg != "success") {
                return res.status(400).json({ message: responseOfJT.data.msg });
            }

            const updatedOrder = await Order.findByIdAndUpdate(orderId, {
                confirmed: "1",
                shippingProvider: "JT",
                billCode: responseOfJT.data.data.billCode
            }, { new: true });

            return res.status(201).json({
                message: responseOfJT.data.msg,
                provider: "JT",
                billCode: responseOfJT.data.data.billCode,
                order: updatedOrder
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Unified endpoint to track an order regardless of provider
 */
export const trackUnifiedOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findOne({
            _id: orderId,
            confirmed: "1",
            deleted: "0"
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found or not confirmed"
            });
        }

        if (order.shippingProvider === 'ACCURATE') {
            // Track with Accurate
            if (!order.accurateTrackingNumber) {
                return res.status(404).json({
                    message: "No tracking number found for this order"
                });
            }

            const shipmentDetails = await getShipment(order.accurateTrackingNumber);

            await Order.findByIdAndUpdate(orderId, {
                accurateStatus: shipmentDetails.status
            });

            return res.status(200).json({
                provider: "ACCURATE",
                trackingNumber: shipmentDetails.trackingNumber,
                status: shipmentDetails.status,
                timeline: shipmentDetails.timeline || [],
                details: shipmentDetails
            });
        } else {
            // Track with J&T (default)
            if (order.billCode === "-" || !order.billCode) {
                return res.status(404).json({
                    message: "Order not confirmed yet or no tracking code available"
                });
            }

            const trackRequestData = generateTrackRequestBody({ billCodes: order.billCode });
            const responseOfJT = await OrderRequest('/logistics/trace', trackRequestData);

            if (responseOfJT.data.data[0].details.length == 0) {
                responseOfJT.data.data[0].details.push({
                    status: "Your order is being prepared. Track again later for shipping updates."
                });
            }

            return res.status(200).json({
                provider: "JT",
                billCode: order.billCode,
                data: responseOfJT.data.data
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Unified endpoint to cancel an order regardless of provider
 */
export const cancelUnifiedOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findOne({
            _id: orderId,
            deleted: "0"
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.shippingProvider === 'ACCURATE') {
            // Cancel with Accurate
            if (order.accurateTrackingNumber) {
                const cancelResponse = await cancelShipment(
                    order.accurateTrackingNumber,
                    req.body.reason || "Cancelled by user"
                );

                await Order.findByIdAndUpdate(orderId, {
                    deleted: "1",
                    accurateStatus: cancelResponse.status
                });

                return res.status(200).json({
                    message: "Order cancelled successfully with Accurate",
                    provider: "ACCURATE",
                    status: cancelResponse.status
                });
            } else {
                await Order.findByIdAndUpdate(orderId, { deleted: "1" });
                return res.status(200).json({
                    message: "Order cancelled locally (no shipment created)",
                    provider: "ACCURATE"
                });
            }
        } else {
            // Cancel with J&T
            const orderData = await Order.findByIdAndUpdate(orderId, { deleted: "1" })
                .select('-_id digest orderType txlogisticId billCode')
                .lean();

            const cancelRequestData = generateJTCancelRequestBody(orderData);
            const responseOfJT = await OrderRequest('/order/cancelOrder', cancelRequestData);

            return res.status(200).json({
                message: responseOfJT.data.msg,
                provider: "JT"
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Print order (J&T only - Accurate doesn't support printing via API)
 */
export const printUnifiedOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { printCod, printSize, showCustomerOrderId } = req.body;

        const order = await Order.findOne({
            _id: orderId,
            deleted: "0",
            confirmed: "1"
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.shippingProvider === 'ACCURATE') {
            return res.status(400).json({
                message: "Printing is not supported for Accurate orders via API. Please use Accurate dashboard."
            });
        }

        // Print with J&T
        if (order.billCode === "-" || !order.billCode) {
            return res.status(404).json({ message: "Order not confirmed" });
        }

        const orderData = {
            billCode: order.billCode,
            customerCode: order.customerCode,
            printCod,
            printSize,
            showCustomerOrderId
        };

        const printRequestData = generateJTPrintRequestBody(orderData);
        const responseOfJT = await OrderRequest('/order/printOrder', printRequestData);

        if (responseOfJT.data.msg == "success") {
            await Order.findByIdAndUpdate(orderId, { printed: "1" }, { new: true });
        }

        const base64content = responseOfJT.data.data.base64EncodeContent;
        const file = Buffer.from(base64content, "base64");

        res.setHeader("Content-Type", "application/pdf");
        res.status(200).write(file);
        res.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get all orders with optional provider filter
 */
export const getAllUnifiedOrders = async (req, res) => {
    try {
        let { page = 1, limit = 10, provider } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const filter = {
            confirmed: "1",
            deleted: "0"
        };

        if (provider && (provider === 'JT' || provider === 'ACCURATE')) {
            filter.shippingProvider = provider;
        }

        const orders = await Order.find(filter)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments(filter);

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

export default {
    createUnifiedOrder,
    confirmUnifiedOrder,
    trackUnifiedOrder,
    cancelUnifiedOrder,
    printUnifiedOrder,
    getAllUnifiedOrders
};
