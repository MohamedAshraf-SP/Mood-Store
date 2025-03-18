import User from "../models/user.js"; // Import the user model
import { hashPassword } from "../utils/generators/authentication.js";


// Get a user by ID
export const getUser = async (req, res) => {
  try {
    const usr = await User.findById(req.params.id);
    if (!usr) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(usr);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new user
export const addUser = async (req, res) => {
  try {

    const currentUsers = await User.find({ userName: req.body.userName });

    if (currentUsers.length > 0) {
      return res.status(400).json({ message: "برجاء اختيار اسم مختلف!" })

    }

    const hashedPassword = await hashPassword(req.body.password)


    const newUser = new User({
      userName: req.body.userName,
      password: hashedPassword,
      userRole: req.body.role,
    });

    const ans = await newUser.save();

    res.status(201).json(ans.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  try {

    const { id } = req.params;
    const currentUsers = await User.findOne({ userName: req.body.userName, _id: { $ne: req.params.id } });

    if (currentUsers) {
      return res.status(400).json({ message: "another user uses this name" })
    }
    const data = {
      userName: req.body.userName,
      userRole: req.body.userRole
    }

    if (req.body?.password) {
      data.password = await hashPassword(req.body.password)
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const getCount = async (req, res) => {
  try {
    const counts = {
      usersCount: await User.countDocuments(),

    }

    res.status(200).json({ counts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
