const { default: mongoose } = require("mongoose");
const SubSection = require("../models/SubSection");
const AppError = require("../utils/appError");
const Section = require("../models/Section");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
const validateUser = require("../utils/validateUser");
const Blog = require("../models/Blogs");

// CREATE SUB SECTION - FUNCTION && LOGIC
exports.createSubSection = async (req, res, next) => {
  try {
    let { sectionId, title, type, text, code, listItems } = req.body;

    await validateUser(req);
    // ALLOWED TYPES VALIDATION
    const allowedTypes = ["text", "image", "video", "code", "list"];
    if (!allowedTypes.includes(type))
      return next(new AppError("Invalid sub section type", 400));

    let imageFile;
    let videoFile;

    // FILES FROM CLIENT
    if (type === "image") {
      imageFile = req.files?.image;
      if (!imageFile) return next(new AppError("Image file is required", 400));
    }

    if (type === "video") {
      videoFile = req.files?.video;
      if (!videoFile) return next(new AppError("Video file is required", 400));
    }

    // VALIDATION
    if (!sectionId || !title || !type) {
      return next(new AppError("All Fields Are Required", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(sectionId))
      return next(new AppError("Invalid section ID", 400));

    const section = await Section.findById(sectionId);

    if (!section) return next(new AppError("Section not found.", 404));

    let subSection;

    // TEXT TYPE
    if (type === "text") {
      if (!text) return next(new AppError("Text is required", 400));

      subSection = await SubSection.create({
        sectionId,
        title,
        type,
        text,
      });
    }

    // IMAGE TYPE
    if (type === "image") {
      const uploadedImage = await uploadFileToCloudinary(imageFile);
      if (!uploadedImage)
        return next(new AppError("Image Uploading Failed", 400));
      subSection = await SubSection.create({
        sectionId,
        title,
        type,
        imageUrl: uploadedImage?.url,
      });
    }

    // VIDEO TYPE
    if (type === "video") {
      const uploadedVideo = await uploadFileToCloudinary(videoFile);
      if (!uploadedVideo)
        return next(new AppError("Video Uploading failed", 400));
      subSection = await SubSection.create({
        sectionId,
        title,
        type,
        videoUrl: uploadedVideo?.url,
      });
    }

    // CODE TYPE
    if (type === "code") {
      if (!code || code.length === 0) {
        return next(new AppError("Code is Required", 400));
      }
      subSection = await SubSection.create({
        sectionId,
        title,
        type,
        code,
      });
    }

    // LIST TYPE
    if (type === "list") {
      if (!listItems || listItems.length === 0)
        return next(new AppError("list is required", 400));

      let items = listItems;

      // string aayi ho to try JSON.parse
      if (typeof items === "string") {
        try {
          const parsed = JSON.parse(items);
          items = Array.isArray(parsed) ? parsed : [items];
        } catch {
          items = [items];
        }
      }

      // validation
      if (!Array.isArray(items) || items.length === 0) {
        return next(
          new AppError("listItems must be a non-empty array or string", 400),
        );
      }

      // clean
      items = items
        .map((item) => item.toString().trim())
        .filter((item) => item !== "");

      if (items.length === 0) {
        return next(new AppError("listItems cannot be empty", 400));
      }

      subSection = await SubSection.create({
        sectionId,
        title,
        type,
        listItems: items,
      });
    }

    if (!subSection) {
      return next(new AppError("Invalid sub section type", 400));
    }

    await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subSections: subSection._id },
      },
      { new: true },
    );

    const updatedBlog = await Blog.findOne({ contents: sectionId }).populate({
      path: "contents",
      populate: {
        path: "subSections",
      },
    });
    return res.status(201).json({
      success: true,
      message: "Sub Section Created",
      data: updatedBlog,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// UPDATE SUB SECTION - FUNCTION && LOGIC
exports.updateSubSection = async (req, res, next) => {
  try {
    let { subSectionId, title, type, text, code, listItems } = req.body;

    await validateUser(req);

    // ALLOWED TYPES VALIDATION
    const allowedTypes = ["text", "image", "video", "code", "list"];
    if (!allowedTypes.includes(type)) {
      return next(new AppError("Invalid sub section type", 400));
    }

    let imageFile;
    let videoFile;

    // FILE VALIDATION BASED ON TYPE
    if (type === "image") {
      imageFile = req.files?.image;
      if (!imageFile) {
        return next(new AppError("Image file is required", 400));
      }
    }

    if (type === "video") {
      videoFile = req.files?.video;
      if (!videoFile) {
        return next(new AppError("Video file is required", 400));
      }
    }

    // BASIC BODY VALIDATION
    if (!subSectionId || !title || !type) {
      return next(new AppError("All Fields Are Required", 400));
    }

    // OBJECT ID VALIDATION
    if (!mongoose.Types.ObjectId.isValid(subSectionId)) {
      return next(new AppError("Invalid sub-section ID", 400));
    }

    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return next(new AppError("Sub - Section not found.", 404));
    }

    // CLEAR PREVIOUS TYPE DATA
    subSection.text = undefined;
    subSection.imageUrl = undefined;
    subSection.videoUrl = undefined;
    subSection.code = undefined;
    subSection.listItems = undefined;

    // TEXT TYPE UPDATE
    if (type === "text") {
      if (!text) {
        return next(new AppError("Text is required", 400));
      }
      subSection.text = text;
    }

    // IMAGE TYPE UPDATE
    if (type === "image") {
      const uploadedImage = await uploadFileToCloudinary(imageFile);
      if (!uploadedImage) {
        return next(new AppError("Image Uploading Failed", 400));
      }
      subSection.imageUrl = uploadedImage.url;
    }

    // VIDEO TYPE UPDATE
    if (type === "video") {
      const uploadedVideo = await uploadFileToCloudinary(videoFile);
      if (!uploadedVideo) {
        return next(new AppError("Video Uploading failed", 400));
      }
      subSection.videoUrl = uploadedVideo.url;
    }

    // CODE TYPE UPDATE
    if (type === "code") {
      if (!code || code.length === 0) {
        return next(new AppError("Code is Required", 400));
      }
      subSection.code = code;
    }

    // LIST TYPE UPDATE
    if (type === "list") {
      if (!listItems || listItems.length === 0) {
        return next(new AppError("list is required", 400));
      }

      let items = listItems;

      // HANDLE STRING OR ARRAY INPUT
      if (typeof items === "string") {
        try {
          const parsed = JSON.parse(items);
          items = Array.isArray(parsed) ? parsed : [items];
        } catch {
          items = [items];
        }
      }

      if (!Array.isArray(items) || items.length === 0) {
        return next(
          new AppError("listItems must be a non-empty array or string", 400),
        );
      }

      items = items
        .map((item) => item.toString().trim())
        .filter((item) => item !== "");

      if (items.length === 0) {
        return next(new AppError("listItems cannot be empty", 400));
      }

      subSection.listItems = items;
    }

    // FINAL COMMON FIELD UPDATE
    subSection.title = title;
    subSection.type = type;

    await subSection.save();

    //  SECTION FIND KRO OR US SECTION SE BLOG

    const section = await Section.findOne({
      subSections: subSectionId,
    });

    if (!section) {
      return next(new AppError("Section not found for this sub section", 404));
    }

    const updatedBlog = await Blog.findOne({
      contents: section._id,
    }).populate({
      path: "contents",
      populate: {
        path: "subSections",
      },
    });

    if (!updatedBlog) {
      return next(new AppError("Blog not found for this section", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Sub Section Updated",
      data: updatedBlog,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// GET ALL SUB-SECTION BY SECTION ID - OPEN API
exports.getSubSectionsBySectionId = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    // OBJECT ID VALIDATION
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return next(new AppError("Invalid Section ID", 400));
    }

    const section = await Section.findById(sectionId).populate("subSections");

    if (!section) {
      return next(new AppError("Section not found.", 404));
    }

    return res.status(200).json({
      success: true,
      message: "All sub sections fetched",
      data: section.subSections,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// GET SUB SECTION BY ID - OPEN API
exports.getSubSection = async (req, res, next) => {
  try {
    const { subSectionId } = req.params;

    // OBJECT ID VALIDATION
    if (!mongoose.Types.ObjectId.isValid(subSectionId)) {
      return next(new AppError("Invalid Sub Section ID", 400));
    }

    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return next(new AppError("Sub Section not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Sub Section fetched",
      data: subSection,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// DELETE SUB SECTION - PROTECTED ROUTE
exports.deleteSubSection = async (req, res, next) => {
  try {
    const { subSectionId } = req.params;
    await validateUser(req);
    // CHECKS
    if (!subSectionId || !mongoose.Types.ObjectId.isValid(subSectionId))
      return next(
        new AppError(
          "Sub Section ID is Required or Invalid sub section ID",
          400,
        ),
      );

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) return next(new AppError("SubSection not found", 404));

    //  SECTION FIND KRO OR US SECTION SE BLOG
    const { sectionId } = subSection;

    // REMOVE SUB SECTION ID FROM SECTION
    await Section.findByIdAndUpdate(subSection.sectionId, {
      $pull: { subSections: subSectionId },
    });

    // DELETE SUB SECTION
    await SubSection.findByIdAndDelete(subSectionId);

    const updatedBlog = await Blog.findOne({
      contents: sectionId,
    }).populate({
      path: "contents",
      populate: {
        path: "subSections",
      },
    });

    if (!updatedBlog) {
      return next(new AppError("Blog not found for this section", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Sub Section Deleted",
      data: updatedBlog,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
