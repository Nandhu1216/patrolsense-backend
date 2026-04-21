const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
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
    type: String
  },

  startTime: Date,
  endTime: Date,

  // ✅ NEW FIELDS
  durationSeconds: Number,
  durationText: String

}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);