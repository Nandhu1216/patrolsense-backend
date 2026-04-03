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

    console.log("REQ BODY:", req.body);

    const { name, employeeId, password, role, phone } = req.body;

    // ✅ Validation
    if (!name || !employeeId || !password || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ Phone format check
    if (!phone.startsWith("+91")) {
      return res.status(400).json({ message: "Phone must start with +91" });
    }

    const exists = await User.findOne({ employeeId });
    if (exists) {
      return res.status(400).json({ message: "Employee exists" });
    }

    const newUser = new User({
      name,
      employeeId,
      password,
      role,
      phone // ✅ ADDED
    });

    await newUser.save();

    res.json({ message: "User created" });

  } catch (err) {
    console.log("CREATE USER ERROR:", err);
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
// ✅ SAVE DEVICE TOKEN (LOGIN)
exports.saveToken = async (req, res) => {
  try {
    const { guardId, deviceToken } = req.body;

    if (!guardId || !deviceToken) {
      return res.status(400).json({ message: "Missing data" });
    }

    await User.findByIdAndUpdate(guardId, {
      deviceToken
    });

    console.log("✅ Token saved:", deviceToken);

    res.json({ message: "Token saved" });

  } catch (err) {
    console.log("SAVE TOKEN ERROR:", err);
    res.status(500).json({ message: "Error saving token" });
  }
};


// ✅ REMOVE DEVICE TOKEN (LOGOUT)
exports.removeToken = async (req, res) => {
  try {
    const { guardId } = req.body;

    await User.findByIdAndUpdate(guardId, {
      deviceToken: null
    });

    console.log("🗑️ Token removed");

    res.json({ message: "Token removed" });

  } catch (err) {
    console.log("REMOVE TOKEN ERROR:", err);
    res.status(500).json({ message: "Error removing token" });
  }
};