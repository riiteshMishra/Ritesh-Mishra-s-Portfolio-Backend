const User = require("../models/User");
const AppError = require("./appError");

const validateUser = async (req) => {
  if (!req.user) {
    throw new AppError("Unauthorized access", 401);
  }

  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user; // full user document
};

module.exports = validateUser;
