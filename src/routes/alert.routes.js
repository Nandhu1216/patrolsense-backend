const express = require("express");
const router = express.Router();

const { sendAlert } = require("../controllers/alertCtrl");

router.post("/send", sendAlert);

module.exports = router;