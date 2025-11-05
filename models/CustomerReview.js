const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailSender");
const {
  reviewApprovalTemplate,
} = require("../emailTemplates/reviewApprovalTemplate");
require("dotenv").config();

const reviewSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 12,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      maxLength: 12,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
    },
    projectName: {
      type: String,
      required: true,
      maxLength: 50,
      lowercase: true,
      trim: true,
    },
    projectLink: {
      type: String,
      required: true,
      trim: true,
      match: /^https?:\/\/[^\s$.?#].[^\s]*$/,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

reviewSchema.post("save", async function (doc) {
  try {
    if (!this.isNew) return;
    const subject = "New Review Received — Please Approve";
    const html = reviewApprovalTemplate(doc);
    //send mail
    await mailSender(process.env.MAIL_USER, subject, html);
  } catch (err) {
    console.log("Sending approve mail to the admin fail", err);
  }
});

const CustomerReview = mongoose.model("CustomerReview", reviewSchema);
module.exports = CustomerReview;
