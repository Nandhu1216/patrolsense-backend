const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    console.log("🔥 LOGIN API HIT");

    const { employeeId, password } = req.body;
    console.log("Request Body:", req.body);

    // 🔍 Find user
    const user = await User.findOne({ employeeId }).lean();

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ User found");

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ Password matched");

    // 🔑 Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Token generated");

    // 🚀 Send response FAST
    return res.status(200).json({
      token,
      role: user.role
    });

  } catch (err) {
    console.log("🔥 LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};