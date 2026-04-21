const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// 🔥 SAVE REPORT
router.post("/", async (req, res) => {
  try {
    console.log("📥 REPORT RECEIVED:", req.body);

    const {
      guardId,
      routeId,
      date,
      startTime,
      endTime,
      durationSeconds,
      durationText
    } = req.body;

    // ✅ fallback (if old format comes)
    const finalDurationSeconds = durationSeconds || 0;
    const finalDurationText =
      durationText || `${Math.floor(finalDurationSeconds / 60)} min ${finalDurationSeconds % 60} sec`;

    const report = new Report({
      guardId,
      routeId,
      date,
      startTime,
      endTime,
      durationSeconds: finalDurationSeconds,
      durationText: finalDurationText
    });

    await report.save();

    res.json({ message: "Report saved successfully" });

  } catch (err) {
    console.log("❌ SAVE ERROR:", err);
    res.status(500).json({ message: "Error saving report" });
  }
});


// 🔥 GET ALL REPORTS
router.get("/", async (req, res) => {
  try {

    const reports = await Report.find()
      .populate("guardId", "name")
      .populate("routeId", "routeName")
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (err) {
    console.log("❌ FETCH ERROR:", err);
    res.status(500).json({ message: "Error fetching reports" });
  }
});

module.exports = router;