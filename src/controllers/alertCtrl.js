const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { guardId, message } = req.body;

    console.log("🚨 ALERT FROM:", guardId);

    // ❌ EXCLUDE CURRENT GUARD
    const users = await User.find({
      _id: { $ne: guardId }
    });

    console.log("📲 USERS TO ALERT:", users.length);

    users.forEach(user => {
      console.log("➡️ SEND ALERT TO:", user.name, user.phone);
      console.log("User:",user._id.toString());
    });

    res.json({ success: true });

  } catch (err) {
    console.log("❌ ALERT ERROR:", err);
    res.status(500).json({ message: "Alert failed" });
  }
});

module.exports = router;