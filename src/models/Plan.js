import mongoose from "mongoose";

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
      order: Number
    }
  ]

}, { timestamps: true });

export default mongoose.model("Plan", planSchema);