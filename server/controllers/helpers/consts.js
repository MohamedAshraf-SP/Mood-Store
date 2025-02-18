import Helper from "../../models/helpers.js";
import User from "../../models/user.js";




export const checkEmail = async (req, res) => {
    try {
        //console.log(req);

        const email = await User.findOne({ userName: req.body.email })
        if (email) {
            return res.status(400).json({ message: "Email already exist!!" })
        }
        return res.status(200).json({ message: "Email is Okey!!" })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
// CREATE - Add a new helper
export const addHelper = async (req, res) => {
    try {
        const { name, value } = req.body;
        const helper = new Helper({ name, value });
        await helper.save();
        res.status(201).json(helper);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// READ - Get all helpers
export const getHelpers = async (req, res) => {
    try {

        let helpers
        if (req.body.search) {
            helpers = await Helper.find({ name: req.body.search });
        } else {
            helpers = await Helper.find();
        }

        res.status(200).json(helpers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ - Get a single helper by ID
export const getHelperById = async (req, res) => {
    try {
        const { id } = req.params;
        const helper = await Helper.findById(id);
        if (!helper) return res.status(404).json({ error: 'Helper not found' });
        res.status(200).json(helper);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE - Update a helper by ID
export const updateHelper = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, value } = req.body;
        const helper = await Helper.findByIdAndUpdate(id, { name, value }, { new: true, runValidators: true });
        if (!helper) return res.status(404).json({ error: 'Helper not found!!' });
        res.status(200).json({ message: 'Data updated successfully!!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE - Delete a helper by ID
export const deleteHelper = async (req, res) => {
    try {
        const { id } = req.params;
        const helper = await Helper.findByIdAndDelete(id);
        if (!helper) return res.status(404).json({ error: 'Helper not found' });
        res.status(200).json({ message: 'Data deleted successfully!!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};