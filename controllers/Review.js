const { default: mongoose, mongo } = require("mongoose");
const AppError = require("../utils/appError");
const User = require("../models/User");
const CustomerReview = require("../models/CustomerReview");

// create review
exports.CreateReview = async (req, res, next) => {
  try {
    let { comment, rating, projectLink, projectName } = req.body;
    const userId = req.user.id;
    // validation
    if (!comment || !rating || !projectLink || !projectName)
      return next(new AppError("All fields are mandatory", 400));

    // sanitization
    comment = comment.toString().trim();
    projectLink = projectLink.toString().trim();
    projectName = projectName.toString().toLowerCase().trim();
    rating = Number(rating);

    // rating validation
    if (isNaN(rating) || rating < 1 || rating > 5)
      return next(
        new AppError("Rating must be a valid number between 1 and 5", 400)
      );

    // user
    if (!mongoose.Types.ObjectId.isValid(userId))
      return next(new AppError("Invalid user Id"));

    // find user
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    // user se uska detail nikalo
    const { firstName, lastName, email, image } = user;
    // check if the user has already given a review to this developer
    const existingReview = await CustomerReview.findOne({ email });

    if (existingReview) {
      return next(
        new AppError("You have already given a review to this developer", 400)
      );
    }

    // ab review create kro
    const review = await CustomerReview.create({
      firstName,
      lastName,
      email,
      image,
      comment,
      rating,
      projectLink,
      projectName,
    });

    console.log("review", review._id);
    user.reviews = review?._id;
    await user.save();
    console.log("review ,", review);
    // return response
    return res.status(200).json({
      success: true,
      message: "Review Created",
      data: review,
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};

// Toggle review
exports.toggleReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.body;

    // validation
    if (!mongoose.Types.ObjectId.isValid(reviewId))
      return next(new AppError("Invalid review id", 400));

    // find review
    const review = await CustomerReview.findById(reviewId);
    if (!review) return next(new AppError("Review not found", 404));

    // find user
    const user = await User.findById(userId);
    if (user?.accountType !== "Admin")
      return next(new AppError("Invalid User", 400));

    // ab review ko update kro
    review.isApproved = !review.isApproved;
    await review.save();

    return res.status(200).json({
      success: true,
      message: `Review ${
        review.isApproved ? "approved" : "disapproved"
      } successfully`,
      data: review,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// update review
exports.updateReview = async (req, res, next) => {
  try {
    let { comment, rating, projectLink, projectName, reviewId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId))
      return next(new AppError("Review id is mandatory", 400));

    //find review
    const review = await CustomerReview.findById(reviewId);
    if (!review) return next(new AppError("Review not found", 404));

    // user
    const userId = req.user?.id;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return next(new AppError("Invalid user Id"));
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    // sanitization
    if (comment) {
      comment = comment.toString().trim();
      review.comment = comment;
    }

    if (rating) {
      if (isNaN(rating) || rating < 1 || rating > 5)
        return next(
          new AppError("Rating must be a valid number between 1 and 5", 400)
        );
      review.rating = rating;
    }

    if (projectName) {
      projectName = projectName.toString().toLowerCase().trim();
      review.projectName = projectName;
    }

    if (projectLink) {
      projectLink = projectLink.toString().trim();
      review.projectLink = projectLink;
    }

    review.isApproved = false;
    await review.save();

    return res.status(200).json({
      success: true,
      message: "review updated successfully",
      data: review,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.body;

    // validation
    if (!mongoose.Types.ObjectId.isValid(userId))
      return next(new AppError("Invalid userId", 400));

    if (!mongoose.Types.ObjectId.isValid(reviewId))
      return next(new AppError("review id is mandatory", 400));

    // find user in db
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    // user validation
    if (user.accountType !== "Admin")
      return next(new AppError("Invalid User", 400));

    // find review in db
    const review = await CustomerReview.findById(reviewId);
    if (!review) return next(new AppError("Review not found", 404));

    // review ko id se delete kro
    await CustomerReview.findByIdAndDelete(reviewId);

    // ab user ke reviews me se id hatao
    user.reviews = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// get all reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    // 100 reviews lo pahale
    const reviews = await CustomerReview.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(100);

    // Top 10 reviews
    const top10Reviews = reviews
      .filter((review) => review.rating >= 4)
      .sort((a, b) => b.rating - a.rating) // sort highest rating first
      .slice(0, 10); // sirf top 10

    const newlyReviewed = reviews.slice(0, 10);

    return res.status(200).json({
      success: true,
      message: "Fetched reviews successfully",
      top10Reviews,
      newlyReviewed,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// get non approved reviews
exports.nonApproved = async (req, res, next) => {
  try {
    const nonApprovedReviews = await CustomerReview.find({ isApproved: false });

    return res.status(200).json({
      success: true,
      message:
        nonApprovedReviews.length > 0
          ? "All non approved reviews fetched successfully"
          : "No non-approved reviews found",
      data: nonApprovedReviews,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// get review by clint
exports.getClientReview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // validation
    if (!mongoose.Types.ObjectId.isValid(userId))
      return next(new AppError("Invalid user Id", 400));

    // find user
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    // find review by this user
    const review = await CustomerReview.findOne({ email: user?.email });

    // return dynamic response
    return res.status(200).json({
      success: true,
      message: review ? "Review fetched successfully" : "Review not found",
      data: review ? review : null,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
