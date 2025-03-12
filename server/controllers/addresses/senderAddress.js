// CRUD Operations

import { Sender } from "../../models/addresses.js";

const createSender = async (req, res) => {
    try {
        const sender = new Sender(req.body);
        await sender.save();
        res.status(201).json({ message: "تم إنشاء المرسل بنجاح", sender });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء إنشاء المرسل", error });
    }
};

const getSenderById = async (req, res) => {
    try {
        const sender = await Sender.findById(req.params.id);
        if (!sender) {
            return res.status(404).json({ message: "المرسل غير موجود" });
        }
        res.status(200).json({ sender });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات المرسل", error });
    }
};
const getDefaultSenderAddress = async (req, res) => {
    try {
        const sender = await Sender.findOne({ default: true });
        if (!sender) {
            return res.status(404).json({ message: "يرجي تحديد عنوان اساسي" });
        }
        res.status(200).json({ sender });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات المرسل", error });
    }
};
const getAllSenders = async (req, res) => {
    try {
        const senders = await Sender.find();

        res.status(200).json({ senders });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات المرسل", error });
    }
};

const updateSender = async (req, res) => {
    try {


        if (req.body?.default == true) {
            console.log(req.body?.default == true);
            await Sender.updateOne({ default: true }, { default: false })
        }
        const sender = await Sender.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sender) {
            return res.status(404).json({ message: "المرسل غير موجود" });
        }

        res.status(200).json({ message: "تم تحديث بيانات المرسل بنجاح", sender });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء تحديث بيانات المرسل", error });
    }
};

const deleteSender = async (req, res) => {
    try {
        const sender = await Sender.findByIdAndDelete(req.params.id);
        if (!sender) {
            return res.status(404).json({ message: "المرسل غير موجود" });
        }
        res.status(200).json({ message: "تم حذف المرسل بنجاح", sender });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء حذف المرسل", error });
    }
};




export { getAllSenders, getDefaultSenderAddress, createSender, getSenderById, updateSender, deleteSender };
