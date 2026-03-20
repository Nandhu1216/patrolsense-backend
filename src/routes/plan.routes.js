const express = require("express");
const router = express.Router();

const Plan = require("../models/Plan");


// ================= CREATE PLAN =================
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
    console.log("Create Plan Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET ALL PLANS =================
router.get("/", async (req, res) => {
  try {

    const plans = await Plan.find().sort({ createdAt: -1 });

    res.json(plans);

  } catch (err) {
    console.log("Fetch Plans Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET SINGLE PLAN =================
router.get("/:id", async (req, res) => {
  try {

    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(plan);

  } catch (err) {
    console.log("Fetch Plan Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= UPDATE PLAN =================
router.put("/:id", async (req, res) => {
  try {

    const { planName, routes } = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      { planName, routes },
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(updatedPlan);

  } catch (err) {
    console.log("Update Plan Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= DELETE PLAN =================
router.delete("/:id", async (req, res) => {
  try {

    const deleted = await Plan.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ message: "Plan deleted successfully" });

  } catch (err) {
    console.log("Delete Plan Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;