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