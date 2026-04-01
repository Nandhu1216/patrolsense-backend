const express = require("express");
const router = express.Router();

const Assignment = require("../models/Assignment");
const Route = require("../models/route");


// ===============================
// 🔥 CREATE ASSIGNMENT
// ===============================
router.post("/", async (req, res) => {
  try {

    const { guardId, date, shift, routes } = req.body;

    if (!routes || routes.length === 0) {
      return res.status(400).json({ message: "Routes required" });
    }

    // 🔥 PREVENT DUPLICATE ASSIGNMENT
    const existing = await Assignment.findOne({ guardId, date, shift });

    if (existing) {
      return res.status(400).json({
        message: "Assignment already exists for this guard/date/shift"
      });
    }

    let finalRoutes = [];

    for (let i = 0; i < routes.length; i++) {

      const route = await Route.findById(routes[i].routeId);

      if (!route) {
        console.log("❌ Route not found:", routes[i].routeId);
        continue;
      }

      finalRoutes.push({
        routeId: route._id,
        routeName: route.routeName,
        order: i + 1,
        status: "pending"
      });
    }

    const newAssignment = new Assignment({
      guardId,
      date,
      shift,
      routes: finalRoutes,
      currentIndex: 0
    });

    await newAssignment.save();

    console.log("✅ Assignment Created");

    res.json(newAssignment);

  } catch (err) {
    console.log("❌ CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===============================
// 🔥 GET ROUTES FOR GUARD
// ===============================
router.get("/:guardId", async (req, res) => {
  try {

    console.log("📥 Fetching assignments for:", req.params.guardId);

    const assignments = await Assignment.find({
      guardId: req.params.guardId
    });

    if (!assignments.length) {
      return res.json([]);
    }

    let allRoutes = [];

    for (let a of assignments) {

      for (let r of a.routes) {

        const routeData = await Route.findById(r.routeId);

        if (!routeData) {
          console.log("❌ Route missing:", r.routeId);
          continue;
        }

        console.log("🧪 CHECKPOINTS FROM DB:", routeData.checkpoints);

        allRoutes.push({
          _id: routeData._id,
          routeName: r.routeName,
          order: r.order,
          status: r.status,
          checkpoints: routeData.checkpoints || [] // 🔥 SAFETY
        });
      }
    }

    // 🔥 SORT ROUTES
    allRoutes.sort((a, b) => a.order - b.order);

    console.log("📦 FINAL ROUTES:", allRoutes);

    res.json(allRoutes);

  } catch (err) {
    console.log("❌ FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;