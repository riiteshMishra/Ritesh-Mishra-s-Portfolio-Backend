const User = require("../models/User");
const Profile = require("../models/Profile");

exports.updateProfile = async (req, res) => {
  try {
    // agar koi jyada hosiyar bn rha hai to kik kr do
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token not found or invalid",
      });
    }
    const {
      age,
      dob,
      bio,
      contactNumber,
      gender,
      address,
      city,
      country,
      website,
      interests,
    } = req.body;

    //  validations
    if (age && (!Number.isInteger(Number(age)) || age < 1 || age > 120))
      return res.status(400).json({ success: false, message: "Invalid age" });

    if (dob && isNaN(Date.parse(dob)))
      return res
        .status(400)
        .json({ success: false, message: "Invalid date of birth" });

    if (bio && bio.length > 500)
      return res.status(400).json({ success: false, message: "Bio too long" });

    if (contactNumber && !/^\d{10}$/.test(contactNumber))
      return res
        .status(400)
        .json({ success: false, message: "Invalid contact number" });

    if (gender && !["Male", "Female", "Other"].includes(gender))
      return res
        .status(400)
        .json({ success: false, message: "Invalid gender" });

    if (website && !/^https?:\/\/\S+\.\S+/.test(website))
      return res
        .status(400)
        .json({ success: false, message: "Invalid website URL" });

    if (interests && !Array.isArray(interests))
      interests = interests.split(",").map((i) => i.trim()); // comma separated string allowed

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        age,
        dob,
        bio,
        contactNumber,
        gender,
        address,
        city,
        country,
        website,
        interests,
      },
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });

   return res.status(200).json({
     success: true,
     message: "Profile updated successfully",
     profile: updatedProfile,
   });
  } catch (err) {
    console.log("ERROR WHILE UPDATING PROFILE", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating user profile",
      error: err.message,
      path: "./controllers/Profile/updateProfile",
    });
  }
};
