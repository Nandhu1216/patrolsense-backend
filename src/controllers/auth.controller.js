const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    console.log("Request Body:", req.body);


    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });

    }
    


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
   


    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
