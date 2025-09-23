const mongoose = require("mongoose");
const User = require("./User");

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    age: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    bio: { type: String, trim: true, lowercase: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dob: { type: Date },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    socials: {
      facebook: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      x: { type: String, trim: true },
      github: { type: String, trim: true },
    },
    interests: [String],
    website: { type: String, trim: true },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
