import user from "../models/user.js"; // Import the user model


// Get a user by ID
export const getUser = async (req, res) => {
  try {
    const usr = await user.findById(req.params.id);
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
    const users = await user.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new user
export const addUser = async (req, res) => {
  try {
    console.log(req);
    const newuser = new user({
      userName: req.body.userName,
      password: req.body.password,
      role: req.body.role,
    });

    const ans = await newuser.save();

    res.status(201).json(ans.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const result = await user.findByIdAndDelete(req.params.id);
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
    const { id } = req.params; // Assuming you use ID to find the user
    const updateduser = await user.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateduser) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(updateduser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
