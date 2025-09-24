const express = require("express");
const {
  sendOtp,
  signup,
  login,
  changePassword,
  generateResetPasswordToken,
  resetPassword,
} = require("../controllers/Auth");
const { auth, isClient, isAdmin } = require("../middlewares/Authorization");
const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/sign-up", signup);
router.post("/log-in", login);
router.post("/change-password", auth, changePassword);
router.post("/generate-reset-password-token", generateResetPasswordToken);
router.post("/reset-password/:token", resetPassword);
module.exports = router;
