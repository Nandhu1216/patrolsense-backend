const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  routeName: String,

  checkpoints: [
    {
      lat: Number,
      lng: Number
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Route", routeSchema);
