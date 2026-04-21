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
      endTime
    } = req.body;

    // ❌ VALIDATION (IMPORTANT)
    if (!guardId || !routeId || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ CONVERT TO DATE
    const start = new Date(startTime);
    const end = new Date(endTime);

    // ❌ INVALID DATE CHECK
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // ✅ CALCULATE DURATION
    let durationSeconds = Math.floor((end - start) / 1000);

    if (durationSeconds < 0) {
      durationSeconds = 0;
    }

    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;

    const durationText = `${minutes} min ${seconds} sec`;

    console.log("⏱ CALCULATED:", durationSeconds, durationText);

    // ✅ SAVE TO DB
    const report = new Report({
      guardId,
      routeId,
      date,
      startTime: start,
      endTime: end,
      durationSeconds,
      durationText
    });

    await report.save();

    console.log("✅ REPORT SAVED SUCCESSFULLY");

    res.json({
      message: "Report saved successfully",
      durationSeconds,
      durationText
    });

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