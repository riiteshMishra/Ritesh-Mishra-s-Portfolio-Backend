const ContactModel = require("../models/Contact-us");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailSender");
const { requestUpdate } = require("../emailTemplates/request_updated");
const { clientRequest } = require("../emailTemplates/clientRequest");
require("dotenv").config();

// Create Contact Request
exports.contactUs = async (req, res, next) => {
  try {
    let { firstName, lastName, email, contactNumber, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !contactNumber || !message) {
      return next(new AppError("All fields are required", 400));
    }

    // Email & Contact number format validation
    const emailRegex = /\S+@\S+\.\S+/;
    const contactRegex = /^\d{10}$/;

    if (!emailRegex.test(email)) {
      return next(new AppError("Invalid email format", 400));
    }

    if (!contactRegex.test(contactNumber)) {
      return next(new AppError("Invalid 10-digit contact number", 400));
    }

    // Sanitize
    firstName = firstName.toString().toLowerCase().trim();
    lastName = lastName.toString().toLowerCase().trim();
    email = email.toString().toLowerCase().trim();
    contactNumber = contactNumber.toString().trim();
    message = message.toString().trim();

    // Save to DB
    const formData = await ContactModel.create({
      firstName,
      lastName,
      email,
      contactNumber,
      message,
    });

    await mailSender(
      process.env.MAIL_USER,
      "A client raised a request",
      clientRequest(formData)
    );
    return res.status(201).json({
      success: true,
      message:
        "Thank you! Your request has been received. Our team will review it and get back to you shortly.",
      formData,
    });
  } catch (err) {
    console.log("Error while sending your request", err);
    return next(new AppError(err.message, 500));
  }
};

// Get All Contact Requests
exports.getAllRequests = async (req, res, next) => {
  try {
    // Optional: Pagination
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 20;
    // const skip = (page - 1) * limit;

    const requests = await ContactModel.find({}); // .skip(skip).limit(limit)

    return res.status(200).json({
      success: true,
      message:
        requests.length === 0
          ? "Currently you don't have any client requests"
          : "All requests fetched successfully",
      data: requests,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// update status
exports.updateStatus = async (req, res, next) => {
  try {
    const { requestId, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(requestId))
      return next(new AppError("Invalid form Id", 400));

    const allowedStatuses = ["pending", "resolved", "rejected"];
    if (!allowedStatuses.includes(status))
      return next(
        new AppError(
          `Invalid status value. Allowed: ${allowedStatuses.join(", ")}`,
          400
        )
      );

    const request = await ContactModel.findById(requestId);
    if (!request) return next(new AppError("Request not found", 404));

    request.status = status;
    await request.save();

    // Email
    if (status === "resolved" || status === "rejected") {
      try {
        await mailSender(
          request.email,
          `Your request has been ${status}`,
          requestUpdate(request.email, status)
        );
      } catch (err) {
        console.error("Mail send failed:", err.message);
      }
    }

    // Clone request for safe response
    const responseData = { ...request.toObject() };

    const statusMessageMap = {
      pending: "Request marked as pending",
      resolved: "Request successfully resolved",
      rejected: "Request has been rejected",
    };

    return res.status(200).json({
      success: true,
      message: statusMessageMap[status],
      data: responseData,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// DELETE REQUESTS BY ID
exports.deleteRequests = async (req, res, next) => {
  try {
    const { requestIds } = req.body;

    if (!requestIds) {
      return next(new AppError("Id required", 400));
    }

    // Normalize ids
    let freshIds = [];

    if (typeof requestIds === "string") {
      if (!mongoose.Types.ObjectId.isValid(requestIds)) {
        return next(new AppError("Invalid Id", 400));
      }
      freshIds = [requestIds];
    } else if (Array.isArray(requestIds)) {
      freshIds = requestIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    }

    if (freshIds.length === 0) {
      return next(new AppError("No valid ids found", 400));
    }

    // MongoDB optimized delete
    const deleted = await ContactModel.deleteMany({
      _id: { $in: freshIds },
    });

    return res.status(200).json({
      success: true,
      message: "Request(s) deleted successfully",
      data: deleted,
    });
  } catch (err) {
    return next(new AppError(err.message || err, 500));
  }
};
