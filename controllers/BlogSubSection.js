const { default: mongoose } = require("mongoose");
const SubSection = require("../models/SubSection");
const AppError = require("../utils/appError");
const Section = require("../models/Section");
const { uploadFileToCloudinary } = require("../utils/fileUploader");

// CREATE SUB SECTION - FUNCTION && LOGIC
exports.createSubSection = async (req, res, next) => {
  try {
    let { sectionId, title, type, text, code, listItems } = req.body;

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

    return res.status(201).json({
      success: true,
      message: "Sub Section Created",
      data: subSection,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// DELETE SUB SECTION - FUNCTION && LOGIC