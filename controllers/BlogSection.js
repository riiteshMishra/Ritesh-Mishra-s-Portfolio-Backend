const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const SectionModel = require("../models/Section");
const User = require("../models/User");
const Blog = require("../models/Blogs");
const validateUser = require("../utils/validateUser");
const Section = require("../models/Section");

// CREATE SECTION - FUNCTION && LOGIC
exports.createSection = async (req, res, next) => {
  try {
    let { blogId, sectionName, description } = req.body;

    // VALIDATION CHECKS
    if (
      !blogId ||
      !sectionName ||
      !description ||
      typeof sectionName !== "string"
    )
      return next(
        new AppError("All Fields are required,please prove a valid data", 400),
      );

    if (!req.user) return next(new AppError("Unauthorized access", 401));

    const { id: userId } = req.user;
    console.log("user id", req.user);
    // console.log("req", blogId, typeof sectionName);

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return next(
        new AppError("Invalid Blog ID , Please Enter a valid ID", 400),
      );
    }

    // USER CHECKS
    const developer = await User.findById(userId);
    if (!developer) return next(new AppError("Developer Not Found", 404));

    // SANITIZE SECTION NAME
    sectionName = sectionName.toString().toLocaleLowerCase().trim();
    description = description.toString().toLocaleLowerCase().trim();

    // CHECK PAHALE SE SECTION HAI TO NHI
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return next(new AppError("Invalid Blog ID", 400));
    }

    // AB CREATE KRNA HAI SECTION - CREATE METHOD SE
    const createdSection = await SectionModel.create({
      blogId,
      sectionName,
      description,
    });

    // AB BLOG KE ANDAR SECTION ID PUSH
    if (createdSection) {
      await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { contents: createdSection._id },
        },
        { new: true },
      );
    }

    return res.status(201).json({
      success: true,
      message: "Section Created",
      data: createdSection,
    });
  } catch (err) {
    return next(new AppError("INTERNAL SERVER ERROR", 500));
  }
};

// UPDATE SECTION - FUNCTION && LOGIC
exports.updateSection = async (req, res, next) => {
  try {
    let { sectionId, sectionName, description } = req.body;
    const user = await validateUser(req);

    // VALIDATION
    let section = await Section.findById(sectionId);
    if (!section) return next(new AppError("Section Not Found", 404));

    // SECTION NAME
    if (sectionName) {
      section.sectionName = sectionName;
    }

    // SECTION DESCRIPTION
    if (description) {
      section.description = description;
    }

    // SECTION SAVE
    await section.save();

    return res.status(200).json({
      success: true,
      message: "Section Updated",
      data: section,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// DELETE SECTION - FUNCTION && LOGIC
exports.deleteSection = async (req, res, next) => {
  try {
    const { sectionId } = req.params;
    const user = await validateUser(req);

    // VALID SECTION ID ????
    const section = await Section.findById(sectionId);
    if (!section) return next(new AppError("Section Not Found", 404));

    // REMOVE SECTION ID FROM BLOG
    await Blog.findByIdAndUpdate(section.blogId, {
      $pull: { contents: sectionId },
    });

    await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section Deleted",
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// GET ALL SECTIONS OF A BLOG - FUNCTION && LOGIC
exports.getAllSectionsByBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const user = await validateUser(req);

    // VALID BLOG ID
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return next(new AppError("Invalid Blog ID", 400));
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return next(new AppError("Blog Not Found", 404));
    }

    const sections = await Section.find({ blogId });

    return res.status(200).json({
      success: true,
      message: "Sections fetched successfully",
      data: sections,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// GET SECTION DETAILS BY SECTION ID - FUNCTION && LOGIC
exports.getSectionById = async (req, res, next) => {
  try {
    const { sectionId } = req.params;
    const user = await validateUser(req);

    // VALID SECTION ID
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return next(new AppError("Invalid Section ID", 400));
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return next(new AppError("Section Not Found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Section details fetched successfully",
      data: section,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

