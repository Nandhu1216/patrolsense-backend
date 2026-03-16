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
    required: true
  },

  patrolStartedAt: Date,
  patrolEndedAt: Date,
  durationSeconds: Number,

  status: {
    type: String,
    enum: ["pending", "started", "completed"],
    default: "pending"
  },

  logs: [
    {
      lat: Number,
      lng: Number,
      timestamp: Date
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
