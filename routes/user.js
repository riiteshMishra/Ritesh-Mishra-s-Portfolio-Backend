const express = require("express");
const { sendOtp, signup, login } = require("../controllers/Auth");
const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/sign-up", signup);
router.post("/log-in", login);
module.exports = router;
