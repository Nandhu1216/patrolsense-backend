const express = require("express");
const router = express.Router();
const { getRouteById } = require("../controllers/route.controller");

const {
  createRoute,
  getRoutes,
  deleteRoute
} = require("../controllers/route.controller");

// CREATE ROUTE
router.post("/", createRoute);

// GET ALL ROUTES
router.get("/", getRoutes);

// DELETE ROUTE
router.delete("/:id", deleteRoute);
router.get("/:id", getRouteById);


module.exports = router;
