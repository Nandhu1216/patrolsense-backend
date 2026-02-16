const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({

  guardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true
  },

  date: {
    type: String,
    required: true
  },

  shift: {
    type: String,
    enum: ["Morning", "Evening", "Night"],
    default: "Morning"
  }

}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
