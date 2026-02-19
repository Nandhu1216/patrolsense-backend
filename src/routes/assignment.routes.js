const express = require("express");
const router = express.Router();
const assignmentCtrl = require("../controllers/assignmentCtrl");
const {
  getAssignments,
  createAssignment,
  deleteAssignment
} = require("../controllers/assignmentCtrl");

router.get("/", getAssignments);
router.post("/", createAssignment);
router.delete("/:id", deleteAssignment);
router.patch("/:id/start", assignmentCtrl.startPatrol);

module.exports = router;
