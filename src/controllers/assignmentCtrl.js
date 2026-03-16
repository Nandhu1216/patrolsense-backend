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

    const { routeId, planId } = req.body;

    // prevent both plan + route
    if (routeId && planId) {
      return res.status(400).json({
        message: "Assign either a route OR a plan"
      });
    }

    const newAssignment = new Assignment(req.body);

    await newAssignment.save();

    res.json({ message: "Assignment created" });

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