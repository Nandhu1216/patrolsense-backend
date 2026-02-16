const User = require("../models/user");

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE USER
exports.createUser = async (req, res) => {
  try {

    console.log("REQ BODY:", req.body); // ⭐ ADD

    const { name, employeeId, password, role } = req.body;

    const exists = await User.findOne({ employeeId });
    if (exists) {
      return res.status(400).json({ message: "Employee exists" });
    }

    const newUser = new User({
      name,
      employeeId,
      password,
      role
    });

    await newUser.save();

    res.json({ message: "User created" });

  } catch (err) {
    console.log("CREATE USER ERROR:", err); // ⭐ VERY IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE USER
exports.deleteUser = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
