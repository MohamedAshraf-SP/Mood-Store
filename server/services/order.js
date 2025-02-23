import Order from "../models/orders.js";

class OrderService {
    // Create a new address
    // static async createOrder(data) {
    //     return await Order.create(data);
    // }

    // Get all orders.js
    static async filterOrders(startDate, endDate = new Date(), phone, gov, city) {
        return await Order.aggregate([
            {
                $match: {
                    "confirmed": "1",
                    "deleted": "0",
                    createdAt: { $gte: startDate, $lte: endDate },
                    "receiver.phone": phone,
                    "receiver.alternateReceiverPhoneNo": phone,
                    "receiver.prov": gov,
                    "receiver.city": city,
                    "receiver.city": city,
                }
            },
            {
                $sort: {
                    createdAt: -1,
                    updatedAt: -1
                }
            },

        ]);
    }

    static async getAllProvinces() {
        return await Order.find();
    }
    static async getAllCitiesOfProvince(Province) {
        return await Order.find({ Province });
    }
    static async getAllAreasOfProvinceAndCity(Province, City) {
        return await Order.find({ Province, City });
    }

    // Get a single address by ID
    // static async getOrderById(id) {
    //     return await Order.findById(id);
    // }

    // Update an address
    // static async updateOrder(id, data) {
    //     return await Order.findByIdAndUpdate(id, data, { new: true });
    // }
    static async disableOrder(Province, City, Area) {
        return await Order.updateOne({ Province, City, Area }, { $set: { enabled: "0" } })
    }
    static async enabledOrder(Province, City, Area) {
        return await Order.updateOne({ Province, City, Area }, { $set: { enabled: "1" } })
    }

    // Delete an address
    // static async deleteOrder(id) {
    //     return await Order.findByIdAndDelete(id);
    // }
}

export default OrderService;
