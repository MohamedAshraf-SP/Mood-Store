// Import the order model
import { all } from "axios";
import Order from "../../models/orders.js";
import { generateJTCancelRequestBody, generateTrackRequestBody, generateJTCreateRequestBody, generateJTPrintRequestBody, OrderRequest } from "../../services/APIs/JT_API.js";
import mongoose from "mongoose";


// Get all orders
export const getJNTOrders = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query; // Default values
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const orders = await Order.find({ confirmed: "1", deleted: "0" })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments({ confirmed: "1", deleted: "0" });

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

export const addJNTOrder = async (req, res) => {
    try {

        const orderData = generateJTCreateRequestBody(req.body, req.body.items)

        orderData.confirmed = "1"

        const savedOrder = await new Order(orderData).save()
        const requestOrderData = await Order.findById(savedOrder._id)
            .select('-_id -createdAt -updatedAt -__v -items._id -sender._id -receiver._id -billCode')
            .lean();

        const responseOfJT = await OrderRequest('/order/addOrder', requestOrderData)

        if (responseOfJT.data.msg == "success") {
            await Order.findByIdAndUpdate(savedOrder._id, { billCode: responseOfJT.data.data.billCode }, {
                new: true,
            });
        }

        res.status(201).json({ message: responseOfJT.data.msg })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const confirmJNTOrder = async (req, res) => {
    try {
        const orderId = req.params.id


        const requestOrderData = await Order.findOne({ _id: orderId, deleted: "0", confirmed: "0" })
            .select('-_id -createdAt -updatedAt -__v -items._id -sender._id -receiver._id -billCode')
            .lean();

        if (!requestOrderData) {
            return res.status(400).json({ message: "order not found Or already confirmed" })
        }

        const responseOfJT = await OrderRequest('/order/addOrder', requestOrderData)
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { confirmed: "1", billCode: responseOfJT.data.data.billCode }, {
            new: true,
        });
        res.status(201).json({ message: responseOfJT.data.message, updatedOrder })
        // res.status(201).json({ requestOrderData })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a order by ID
export const printJNTOrder = async (req, res) => {
    try {

        let { printCod, printSize, showCustomerOrderId } = req.body
        // console.log(printCod, printSize, showCustomerOrderId);
        let orderData = await Order.findOne({ _id: req.params.id, deleted: "0", confirmed: "1" })
            .select('-_id  billCode customerCode')
            .lean();
        console.log(orderData);

        if (!orderData) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (orderData.billCode == "-") {
            return res.status(404).json({ message: "Order not Confirmed" });
        }

        orderData.printCod = printCod
        orderData.printSize = printSize
        orderData.showCustomerOrderId = showCustomerOrderId


        let printRequestData = generateJTPrintRequestBody(orderData)
        // let  cancelRequestData= generateJTCancelRequestBody({txlogisticId:"SYS-685489473"})

        ///console.log(orderData,printRequestData);

        const responseOfJT = await OrderRequest('/order/printOrder', printRequestData)

        const base64content = responseOfJT.data.data.base64EncodeContent
        const file = Buffer.from(base64content, "base64")
        // console.log(responseOfJT.data.data.base64EncodeContent);

        res.setHeader("Content-Type", "application/pdf");
        res.status(200).write(file)
        res.end()
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const cancelJNTOrder = async (req, res) => {
    try {
        let orderData = await Order.findByIdAndUpdate(req.params.id, { deleted: "1" })
            .select('-_id digest orderType txlogisticId billCode')
            .lean();
        //  console.log(orderData);


        let cancelRequestData = generateJTCancelRequestBody(orderData)
        // let  cancelRequestData= generateJTCancelRequestBody({txlogisticId:"SYS-685489473"})

        //  console.log(orderData,cancelRequestData);

        const responseOfJT = await OrderRequest('/order/cancelOrder', cancelRequestData)
        if (!orderData) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ deleteMessage: responseOfJT.data.msg });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const trackOrder = async (req, res) => {
    try {

        const { ObjectId } = mongoose.Types;
        let requestData = await Order.aggregate([
            {
                $match: {
                    _id: new ObjectId(`${req.params.id}`),
                    "confirmed": "1",
                    "deleted": "0"
                }
            },
            {
                $project: {  // for renaming fields
                    _id: 0,
                    //  deleted: "hello",
                    billCodes: "$billCode", // Rename billCode to bill codes
                }
            },

        ])
        console.log(requestData);
        //     if(requestData.length<1)return res.status(404).json({message:"order not confirmed or not exist"})

        let requestData1 = { billCodes: "JEG000282544108" }


        //   let allRequestData = generateTrackRequestBody(requestData[0])
        let allRequestData = generateTrackRequestBody(requestData1)

        console.log(allRequestData)

        const responseOfJT = await OrderRequest('/logistics/trace', allRequestData)

        res.status(200).json({ data: responseOfJT.data.data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a order by ID
// export const updateJNTOrder = async (req, res) => {
//     try {
//         const { id } = req.params; // Assuming you use ID to find the order
//         const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
//             new: true,
//         });
//         if (!updatedOrder) {
//             return res.status(404).json({ message: "order not found" });
//         }
//         res.status(200).json(updatedOrder);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

