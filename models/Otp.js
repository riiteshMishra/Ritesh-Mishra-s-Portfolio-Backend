const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailSender");
const { signUpOtpTemplate } = require("../emailTemplates/signupTemplate");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

otpSchema.post("save", async function (doc) {
  try {
    await mailSender(
      doc.email,
      "Ritesh Mishra's Portfolio",
      signUpOtpTemplate(doc.email, doc.otp)
    );
  } catch (error) {
    console.error("Error sending OTP mail:", error);
  }
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
