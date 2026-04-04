const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    console.log("🚀 ALERT ROUTE HIT");

    const { guardId, message } = req.body;

    if (!guardId) {
      return res.status(400).json({ message: "guardId missing" });
    }

    console.log("🚨 ALERT FROM:", guardId);

    const users = await User.find({
      _id: { $ne: new mongoose.Types.ObjectId(guardId) }
    });

    console.log("📲 USERS TO ALERT:", users.length);

    users.forEach(user => {
      console.log("USER:", user._id.toString());
    });

    res.json({ success: true });

  } catch (err) {
    console.log("❌ ALERT ERROR:", err);
    res.status(500).json({ message: "Alert failed" });
  }
});

module.exports = router;