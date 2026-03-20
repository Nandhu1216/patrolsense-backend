const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({

  planName: {
    type: String,
    required: true
  },

  routes: [
    {
      routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route"
      },
      routeName: String,
      order: Number
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Plan", planSchema);