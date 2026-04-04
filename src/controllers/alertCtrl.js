const User = require("../models/user");
const mongoose = require("mongoose");

exports.sendAlert = async (req, res) => {
  try {
    const { guardId, message, location, mapLink } = req.body;

    console.log("🚨 ALERT TRIGGERED");
    console.log("🆔 Guard:", guardId);
    console.log("📩 Message:", message);
    console.log("📍 Location:", location);
    console.log("🗺 Map:", mapLink);

    // ✅ GET ALL USERS EXCEPT CURRENT GUARD
    const users = await User.find({
      _id: { $ne: new mongoose.Types.ObjectId(guardId) }
    });

    // 📞 PHONE NUMBERS
    const phoneNumbers = users.map(user => user.phone);

    console.log("📞 PHONE LIST:", phoneNumbers);

    // 🔥 SIMULATE ALERT (later replace with Firebase)
    users.forEach(user => {
      console.log(`🚨 Alert sent to ${user.phone}`);
      console.log(`➡️ ${message}`);
      console.log(`📍 ${mapLink}`);
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