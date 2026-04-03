const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  deleteUser,
  saveToken,      // ✅ ADD
  removeToken     // ✅ ADD
} = require("../controllers/userCtrl");

// EXISTING ROUTES
router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);

// 🔥 NEW ROUTES
router.post("/save-token", saveToken);
router.post("/remove-token", removeToken);

module.exports = router;