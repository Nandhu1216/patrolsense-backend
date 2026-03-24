const express = require("express");
const router = express.Router();

const Assignment = require("../models/Assignment");
const Plan = require("../models/Plan");
const Route = require("../models/route");

// CREATE
router.post("/", async (req, res) => {

  const { guardId, date, shift, planId, routeId } = req.body;

  let finalRoutes = [];

  // PLAN → EXPAND
  if (planId) {
    const plan = await Plan.findById(planId);

    finalRoutes = plan.routes.map(r => ({
      routeId: r.routeId,
      routeName: r.routeName,
      order: r.order,
      status: "pending"
    }));
  }

  // SINGLE ROUTE
  if (routeId) {
    const route = await Route.findById(routeId);

    finalRoutes = [{
      routeId: route._id,
      routeName: route.routeName,
      order: 1,
      status: "pending"
    }];
  }

  const newAssignment = new Assignment({
    guardId,
    date,
    shift,
    routes: finalRoutes
  });

  await newAssignment.save();

  res.json(newAssignment);
});

// GET BY GUARD
router.get("/:guardId", async (req, res) => {
  const data = await Assignment.find({ guardId: req.params.guardId });
  res.json(data);
});

module.exports = router;