const mongoose = require("mongoose");

exports.sendOtp = async () => {
  try {
      
  } catch (err) {
    console.log("ERROR WHILE SENDING EMAIL", err);
    return res.status(500).json({
      success: false,
      message: "Mail sending failed",
      error: err.message,
    });
  }
};
