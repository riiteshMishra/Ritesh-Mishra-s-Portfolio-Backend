const express = require("express");
const { sendOtp, signUp } = require("../controllers/Auth");
const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/sign-up", signUp);
module.exports = router;
