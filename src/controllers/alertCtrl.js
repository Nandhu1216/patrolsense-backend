const User = require("../models/user");

exports.sendAlert = async (req, res) => {
  try {
    const { message } = req.body;

    console.log("🚨 ALERT TRIGGERED:", message);

    // 🔥 GET ALL USERS (guards + supervisors)
    const users = await User.find({
      role: { $in: ["guard", "supervisor"] }
    });

    // 📞 GET PHONE NUMBERS
    const phoneNumbers = users.map(user => user.phone);

    console.log("📞 PHONE LIST:", phoneNumbers);

    // 🔥 SIMULATE ALERT
    phoneNumbers.forEach(num => {
      console.log(`🚨 Alert sent to ${num}: ${message}`);
    });

    res.json({
      success: true,
      totalUsers: phoneNumbers.length
    });

  } catch (err) {
    console.log("❌ ALERT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};