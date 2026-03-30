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

    let finalRoutes = [];

    for (let i = 0; i < routes.length; i++) {

      const route = await Route.findById(routes[i].routeId);

      if (!route) continue;

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

    res.json(newAssignment);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===============================
// 🔥 GET ROUTES FOR GUARD
// ===============================
router.get("/:guardId", async (req, res) => {
  try {

    const assignments = await Assignment.find({
      guardId: req.params.guardId
    });

    let allRoutes = [];

    for (let a of assignments) {

      for (let r of a.routes) {

        const routeData = await Route.findById(r.routeId);

        if (!routeData) continue;

        allRoutes.push({
          _id: routeData._id,
          routeName: r.routeName,
          order: r.order,
          status: r.status,
          checkpoints: routeData.checkpoints
        });
      }
    }

    allRoutes.sort((a, b) => a.order - b.order);

    res.json(allRoutes);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;