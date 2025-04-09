
import Order from "../../models/orders.js";


export const getOrder = async (req, res) => {
    try {
        const usr = await Order.findById(req.params.id);
        if (!usr) {
            return res.status(404).json({ message: "order not found" });
        }
        res.status(200).json(usr);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
/*
export const searchOrders = async (req, res) => {
    try {
        const { confirmed,reciverPhone, billCode, txlogisticId, itemName, startDate, endDate } = req.body;

        let filter = {};

        if (reciverPhone) {
            filter['receiver.mobile'] = reciverPhone; // Search in receiver's phone
        }
        if (reciverPhone) {
            filter['confirmed'] = confirmed; // Search in receiver's phone
        }
        if (billCode) {
            filter.billCode = billCode;
        }
        if (txlogisticId) {
            filter.txlogisticId = txlogisticId;
        }
        if (itemName) {
            filter['items.itemName'] = { $regex: itemName, $options: 'i' }; // Case-insensitive partial match
            filter['items.englishName'] = { $regex: itemName, $options: 'i' }; // Case-insensitive partial match
        }
        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }; // Filter by date range
        } else if (startDate) {
            filter.createdAt = { $gte: new Date(startDate) };
        } else if (endDate) {
            filter.createdAt = { $lte: new Date(endDate) };
        }

        if (startDate && endDate) {
            filter.updatedAt = { $gte: new Date(startDate), $lte: new Date(endDate) }; // Filter by date range
        } else if (startDate) {
            filter.updatedAt = { $gte: new Date(startDate) };
        } else if (endDate) {
            filter.updatedAt = { $lte: new Date(endDate) };
        }

        const orders = await Order.find(filter);

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error searching orders', error });
    }
};
*/

export const searchOrders = async (req, res) => {
    try {
        const { confirmed, receiverphone, printed,
            billCode, txlogisticId, itemName,
            startDate, endDate } = req.body;


        let filter = { $and: [] };
        let confirmStatus = {}
        let printStatus = {}

        if (confirmed) confirmStatus["confirmed"] = confirmed
        if (printed) printStatus["printed"] = printed
        if (receiverphone) filter.$and.push({ "receiver.mobile": receiverphone });
        if (billCode) filter.$and.push({ billCode });
        if (txlogisticId) filter.$and.push({ txlogisticId });
        if (itemName) filter.$and.push({ "items.itemName": { $regex: itemName, $options: "i" } }); // Case-insensitive search

        if (startDate && endDate) {
            filter.$and.push({
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            });
        } else if (startDate) {
            filter.$and.push({ createdAt: { $gte: new Date(startDate) } });
        } else if (endDate) {
            filter.$and.push({ createdAt: { $lte: new Date(endDate) } });
        }

        // If no search fields were provided, return all orders
        if (filter.$and.length === 0) delete filter.$and;

        //console.log(filter);
        const orders = await Order.find({ $and: [filter, confirmStatus, printStatus, { deleted: "0" }] })
            ;

        //console.log(orders);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
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