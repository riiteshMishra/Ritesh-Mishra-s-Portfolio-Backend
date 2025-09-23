const mongoose = require("mongoose");
const OTP = require("../models/Otp");
const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");

// send otp
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = 23423;

    const otpData = await OTP.create({
      email: email,
      otp: otp,
    });
    res.status(200).json({
      success: true,
      message: "otp send to the email",
      otp: otpData.otp,
    });
  } catch (err) {
    console.log("ERROR WHILE SENDING EMAIL", err);
    return res.status(500).json({
      success: false,
      message: "Mail sending failed",
      error: err.message,
      path: "./controllers/send-otp",
    });
  }
};

// sign-up
exports.signUp = async (req, res) => {
  try {
    // data fetch
    let {
      firstName,
      lastName,
      email,
      accountType,
      password,
      confirmPassword,
      otp,
    } = req.body;

    //validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp ||
      !accountType
    )
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    // sanitization
    firstName = firstName.toString().trim().toLowerCase();
    lastName = lastName.toString().trim().toLowerCase();
    email = email.toString().trim().toLowerCase();
    accountType = accountType.trim().toString();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    // password !== confirmPassword return
    if (password !== confirmPassword)
      return res.status(400).json({
        success: false,
        message: "confirm password do not matched",
      });

    // agar user pahale se signup hoga to return ho jao
    const existingUser = await User.findOne({
      email: email,
    });

    if (existingUser)
      return res.status(409).json({
        success: false,
        message: "User already exists, please login",
      });

    // otp match
    const databaseOTP = await OTP.findOne({ email });

    if (!databaseOTP) {
      return res.status(404).json({
        success: false,
        message: "OTP not found",
      });
    } else if (databaseOTP.otp.toString() !== otp.toString()) {
      return res.status(422).json({
        success: false,
        message: "OTP not matched or may be otp expired",
      });
    }
    await OTP.findOneAndDelete({ email });
    // create hashed password
    const HashedPassword = await bcrypt.hash(password, 10);

    const avatar = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}/${lastName}`;

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      image: avatar,
      accountType: accountType,
      password: HashedPassword,
    });

    // create profile
    const profileData = await Profile.create({
      user: user._id,
      age: null,
      bio: null,
      contactNumber: null,
      gender: null,
      dob: null,
      city: null,
      country: "india",
      interests: null,
      website: null,
      socials: {
        facebook: null,
        linkedin: null,
        github: null,
        x: null,
      },
    });
    user.profile = profileData._id;
    await user.save();

    // return user in response
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: user,
    });
  } catch (err) {
    console.log("ERROR WHILE SIGN UP", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
      path: "./controllers/sign-up",
    });
  }
};
