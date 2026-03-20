const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({

  planName: {
    type: String,
    required: true,
    trim: true
  },

  routes: [
    {
      routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
        required: true
      },
      routeName: String,
      order: Number
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Plan", planSchema);