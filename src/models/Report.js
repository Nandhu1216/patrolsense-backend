const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  guardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route"
  },
  date: String,
  startTime: Date,
  endTime: Date,
  duration: Number
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);