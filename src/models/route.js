const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true
  },

  checkpoints: [
    {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Route", routeSchema);