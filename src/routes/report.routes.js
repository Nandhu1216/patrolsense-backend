const express = require("express");
const router = express.Router();

const Report = require("../models/Report");

// SAVE REPORT
router.post("/", async (req, res) => {
  try {

    const report = new Report(req.body);
    await report.save();

    res.json({ message: "Report saved" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET REPORTS (ADMIN)
router.get("/", async (req, res) => {
  try {

    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;