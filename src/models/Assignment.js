const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({

  guardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  date: String,
  shift: String,

  routes: [
    {
      routeId: mongoose.Schema.Types.ObjectId,
      routeName: String,
      order: Number,
      status: {
        type: String,
        default: "pending"
      }
    }
  ],

  currentIndex: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);