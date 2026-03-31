const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// 🔥 SAVE REPORT
router.post("/", async (req, res) => {
  try {
    console.log("📥 REPORT RECEIVED:", req.body);

    const report = new Report(req.body);
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