const mongoose = require("mongoose");
const Profile = require("./Profile");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, lowercase: true },
    lastName: { type: String, required: true, trim: true, lowercase: true },
    accountType: { type: String, required: true, enum: ["Client", "Admin"] },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true, trim: true, minlength: 8 },
    image: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    // status for user active or not
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    profile: {
      type: mongoose.Types.ObjectId,
      ref: "Profile",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    blogs: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
