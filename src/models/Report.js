const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  guardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  date: String,
  routeId: String,

  startTime: Date,
  endTime: Date,

  duration: Number // seconds

}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);