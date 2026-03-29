const Assignment = require("../models/Assignment");


// GET ALL ASSIGNMENTS
exports.getAssignments = async (req, res) => {
  try {

    const data = await Assignment.find()
      .populate("guardId", "name employeeId")
      .populate("routeId", "routeName checkpoints")
      .populate({
        path: "planId",
        populate: {
          path: "routes.routeId",
          select: "routeName checkpoints"
        }
      });

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};



// GET SINGLE ASSIGNMENT
exports.getAssignmentById = async (req, res) => {
  try {

    const assignment = await Assignment.findById(req.params.id)
      .populate("guardId")
      .populate("routeId")
      .populate({
        path: "planId",
        populate: {
          path: "routes.routeId"
        }
      });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // SECURITY CHECK
    if (assignment.guardId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Convert assignment into routes list for guard app
    let routes = [];

    // SINGLE ROUTE
    if (assignment.routeId) {
      routes = [assignment.routeId];
    }

    // PLAN ROUTES
    if (assignment.planId) {
      routes = assignment.planId.routes
        .sort((a, b) => a.order - b.order)
        .map(r => r.routeId);
    }

    res.json({
      assignment,
      routes
    });

  } catch (err) {
    console.log("Fetch Assignment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// CREATE ASSIGNMENT


exports.createAssignment = async (req, res) => {
  try {

    const { guardId, date, shift, routeId, planId } = req.body;

    // ❌ prevent both
    if (routeId && planId) {
      return res.status(400).json({
        message: "Assign either a route OR a plan"
      });
    }

    let finalRoutes = [];

    // 🔥 IF PLAN
    if (planId) {
      const plan = await Plan.findById(planId).populate("routes.routeId");

      finalRoutes = plan.routes.map(r => ({
        routeId: r.routeId._id,
        routeName: r.routeId.routeName,
        order: r.order,
        status: "pending"
      }));
    }

    // 🔥 IF SINGLE ROUTE
    if (routeId) {
      const route = await Route.findById(routeId);

      finalRoutes = [{
        routeId: route._id,
        routeName: route.routeName,
        order: 1,
        status: "pending"
      }];
    }

    // 🔥 CREATE WITH ROUTES ARRAY
    const newAssignment = new Assignment({
      guardId,
      date,
      shift,
      routes: finalRoutes,   // ✅ IMPORTANT FIX
      currentIndex: 0
    });

    await newAssignment.save();

    res.json(newAssignment);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE ASSIGNMENT
exports.deleteAssignment = async (req, res) => {
  try {

    await Assignment.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// START PATROL
exports.startPatrol = async (req, res) => {
  try {

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    assignment.patrolStartedAt = new Date();
    assignment.status = "started";

    await assignment.save();

    res.json({ message: "Patrol started" });

  } catch (err) {
    console.log("Start Patrol Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// LOG GUARD LOCATION
exports.logLocation = async (req, res) => {
  try {

    const { lat, lng, timestamp } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    assignment.logs.push({
      lat,
      lng,
      timestamp
    });

    await assignment.save();

    res.json({ message: "Location logged" });

  } catch (err) {
    console.log("Location Log Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// COMPLETE PATROL
exports.completePatrol = async (req, res) => {
  try {

    const { patrolEndedAt, durationSeconds } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    assignment.patrolEndedAt = patrolEndedAt;
    assignment.durationSeconds = durationSeconds;
    assignment.status = "completed";

    await assignment.save();

    res.json({ message: "Patrol completed" });

  } catch (err) {
    console.log("Complete Patrol Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// GET ASSIGNMENTS BY GUARD (FOR APP)
exports.getAssignmentsByGuard = async (req, res) => {
  try {

    const { guardId } = req.params;

    const assignments = await Assignment.find({ guardId })
      .populate("routeId", "routeName checkpoints")
      .populate({
        path: "planId",
        populate: {
          path: "routes.routeId",
          select: "routeName checkpoints"
        }
      });

    let allRoutes = [];

    for (let a of assignments) {

      // 🔹 SINGLE ROUTE
      if (a.routeId) {
        allRoutes.push({
          _id: a.routeId._id,
          routeName: a.routeId.routeName,
          checkpoints: a.routeId.checkpoints,
          order: 1,
          status: "pending"
        });
      }

      // 🔹 PLAN ROUTES
      if (a.planId) {
        const sorted = a.planId.routes.sort(
          (x, y) => x.order - y.order
        );

        for (let r of sorted) {
          allRoutes.push({
            _id: r.routeId._id,
            routeName: r.routeId.routeName,
            checkpoints: r.routeId.checkpoints,
            order: r.order,
            status: r.status || "pending"
          });
        }
      }
    }

    // 🔥 sort final
    allRoutes.sort((a, b) => a.order - b.order);

    res.json(allRoutes);

  } catch (err) {
    console.log("Guard Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};