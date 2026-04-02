const Route = require("../models/route");

// CREATE ROUTE
exports.createRoute = async (req, res) => {
  try {

    const { routeName, checkpoints } = req.body;

    if (!routeName) {
      return res.status(400).json({
        message: "Route name required"
      });
    }

    if (!checkpoints || checkpoints.length === 0) {
      return res.status(400).json({
        message: "Checkpoints required"
      });
    }

    // 🔥 CLEAN CHECKPOINTS (MAIN FIX)
    const cleanedCheckpoints = checkpoints.filter(cp =>
      cp && cp.lat && cp.lng
    );

    if (cleanedCheckpoints.length === 0) {
      return res.status(400).json({
        message: "Valid checkpoints required"
      });
    }

    const route = new Route({
      routeName,
      checkpoints: cleanedCheckpoints
    });

    await route.save();

    console.log("✅ Route Created:", route);

    res.json(route);

  } catch (err) {
    console.log("❌ ROUTE CREATE ERROR:", err);
    res.status(500).json({ message: "Error saving route" });
  }
}; 

// GET ALL ROUTES
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching routes" });
  }
};

// DELETE ROUTE
exports.deleteRoute = async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.json({ message: "Route deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting route" });
  }
};
exports.getRouteById = async (req, res) => {
  try {

    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json(route);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
