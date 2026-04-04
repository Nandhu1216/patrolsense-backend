const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {

    const { guardId, message, location, mapLink } = req.body;

    console.log("🚨 ALERT RECEIVED");
    console.log("🆔 Guard:", guardId);
    console.log("📩 Message:", message);
    console.log("📍 Location:", location);
    console.log("🗺 Map Link:", mapLink);

    // ✅ SEND TO OTHER USERS ONLY
    const users = await User.find({
      _id: { $ne: new mongoose.Types.ObjectId(guardId) }
    });

    console.log("📲 SEND TO USERS:", users.length);

    users.forEach(user => {
      console.log("➡️ ALERT TO:", user._id.toString());

      // 👉 later: send Firebase here
    });

    res.json({ success: true });

  } catch (err) {
    console.log("❌ ALERT ERROR:", err);
    res.status(500).json({ message: "Error sending alert" });
  }
});

module.exports = router;