const Assignment = require("../models/Assignment");

// GET ALL ASSIGNMENTS
exports.getAssignments = async (req, res) => {
  try {

    const data = await Assignment.find()
      .populate("guardId", "name employeeId")
      .populate("routeId", "routeName");

    res.json(data);

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE ASSIGNMENT
exports.createAssignment = async (req, res) => {
  try {

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

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
