const User = require("../models/User");
const Profile = require("../models/Profile");
const AppError = require("../utils/appError");
const Blog = require("../models/Blogs");
const mongoose = require("mongoose");

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

    if (bio && bio.length > 150)
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

// delete account
exports.deleteAccount = async (req, res, next) => {
  try {
    let accountId = req.user.id;
    const userName = `${req.user.firstName} ${req.user.lastName}`;
    if (!accountId) return next(new AppError("Account Id is required", 400));

    //find in db
    const user = await User.findById(accountId).populate("profile blogs");
    if (!user) return next(new AppError("User not found", 404));

    // delete blogs created by this user
    if (user.blogs && user.blogs.length > 0) {
      for (let blog of user.blogs) {
        await Blog.findByIdAndDelete(blog._id);
      }
    }

    if (user.profile) await Profile.findByIdAndDelete(user.profile._id);

    // Delete user account
    await User.findByIdAndDelete(accountId);
    return res.status(200).json({
      success: true,
      message: `Goodbye ${userName} your account is deleted permanently`,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// admin only
exports.findAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      accountType: "Client",
    }).select({
      firstName: 1,
      lastName: 1,
      email: 1,
    });

    if (users.length === 0)
      return next(new AppError("We have not any clients at the moment"));

    return res.status(200).json({
      success: true,
      message: `All users founded ${users.length}`,
      data: users,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// authorized route :- get user details
exports.getUserDetails = async (req, res, next) => {
  try {
    // get user form req.body
    const userId = req.user.id;

    // Validation
    if (!userId) return next(new AppError("User id not found", 400));

    // find user by id
    const user = await User.findById(userId)
      .populate("profile")
      .select("-password")
      .populate("blogs");
    if (!user) return next(new AppError("User not found", 404));

    //return response
    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// Admin blogs
exports.userBlogs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return next(new AppError("User Id not found", 400));

    if (!mongoose.Types.ObjectId.isValid(userId))
      return next(new AppError("Invalid user id."));
    // find user form userID
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User Not Found", 404));

    // all blogs by this user
    const blogs = await Blog.find({ author: userId });

    if (blogs.length === 0)
      return res.status(200).json({
        success: true,
        message: "Currently you have not created any blog,",
      });

    return res.status(200).json({
      success: true,
      message: "All blogs by you fetched successfully",
      blog: blogs,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
