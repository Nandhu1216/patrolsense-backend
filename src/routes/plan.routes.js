const express = require("express");
const router = express.Router();

const Plan = require("../models/Plan");


// ✅ CREATE PLAN
router.post("/", async (req, res) => {
  try {

    const { planName, routes } = req.body;

    if (!planName || !routes || routes.length === 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const newPlan = new Plan({
      planName,
      routes
    });

    await newPlan.save();

    res.status(201).json(newPlan);

  } catch (err) {
    res.status(500).json({ message: "Error creating plan" });
  }
});


// ✅ GET ALL PLANS
router.get("/", async (req, res) => {
  try {

    const plans = await Plan.find().sort({ createdAt: -1 });

    res.json(plans);

  } catch (err) {
    res.status(500).json({ message: "Error fetching plans" });
  }
});


// ✅ DELETE PLAN
router.delete("/:id", async (req, res) => {
  try {

    await Plan.findByIdAndDelete(req.params.id);

    res.json({ message: "Plan deleted" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting plan" });
  }
});


module.exports = router;