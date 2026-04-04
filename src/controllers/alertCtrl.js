const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { guardId, message } = req.body;

    console.log("🚨 ALERT FROM:", guardId);

    // ❌ EXCLUDE THIS GUARD
    const users = await User.find({
      _id: { $ne: guardId }
    });

    console.log("📲 SEND ALERT TO:", users.length, "users");

    // 👉 FOR NOW just log (later we add Firebase)
    users.forEach(user => {
      console.log("SEND TO:", user.phone);
    });

    res.json({ success: true });

  } catch (err) {
    console.log("❌ ALERT ERROR:", err);
    res.status(500).json({ message: "Error sending alert" });
  }
});