const express = require("express");
const router = express.Router();

const Assignment = require("../models/Assignment");
const Plan = require("../models/Plan");
const Route = require("../models/route");


// ===============================
// 🔥 CREATE ASSIGNMENT
// ===============================
router.post("/", async (req, res) => {
  try {

    console.log("🔥 CREATE ASSIGNMENT HIT");

    const { guardId, date, shift, planId, routeId } = req.body;

    // ❌ Prevent both
    if (planId && routeId) {
      return res.status(400).json({
        message: "Assign either a plan OR a route"
      });
    }

    let finalRoutes = [];

    // ===============================
    // 🔹 PLAN → EXPAND ROUTES
    // ===============================
    if (planId) {
      const plan = await Plan.findById(planId);

      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }

      console.log("PLAN:", plan);

      finalRoutes = plan.routes.map(r => ({
        routeId: r.routeId,
        routeName: r.routeName, // already stored
        order: r.order,
        status: "pending"
      }));
    }

    // ===============================
    // 🔹 SINGLE ROUTE
    // ===============================
    if (routeId) {
      const route = await Route.findById(routeId);

      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }

      finalRoutes = [{
        routeId: route._id,
        routeName: route.routeName,
        order: 1,
        status: "pending"
      }];
    }

    // ===============================
    // 🔥 SAVE ASSIGNMENT
    // ===============================
    const newAssignment = new Assignment({
      guardId,
      date,
      shift,
      routes: finalRoutes,
      currentIndex: 0
    });

    await newAssignment.save();

    console.log("FINAL ROUTES SAVED:", finalRoutes);

    res.json(newAssignment);

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===============================
// 🔥 GET ROUTES FOR GUARD (APP)
// ===============================
router.get("/:guardId", async (req, res) => {
  try {

    const { guardId } = req.params;

    const assignments = await Assignment.find({ guardId });

    let allRoutes = [];

    for (let a of assignments) {

      for (let r of a.routes) {

        const routeData = await Route.findById(r.routeId);

        if (!routeData) continue;

        allRoutes.push({
          _id: routeData._id,
          routeName: r.routeName,
          order: r.order,
          status: r.status || "pending",
          checkpoints: routeData.checkpoints // 🔥 needed for tracking
        });
      }
    }

    // 🔥 SORT ROUTES
    allRoutes.sort((a, b) => a.order - b.order);

    res.json(allRoutes);

  } catch (err) {
    console.log("FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;