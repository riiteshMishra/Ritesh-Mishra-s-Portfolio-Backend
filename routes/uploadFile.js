const express = require("express");
const { auth, isAdmin } = require("../middlewares/Authorization");
const AppError = require("../utils/appError");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
const router = express.Router();

router.post("/upload-file", auth, isAdmin, async (req, res, next) => {
  try {
    const { file } = req.files;

    if (!file) return next(new AppError("File is required", 400));

    // file upload
    const uploadedFile = await uploadFileToCloudinary(file);

    console.log("uploaded file", uploadedFile);
    if (!uploadedFile.url) return next(new AppError("File upload failed", 400));

    return res.status(200).json({
      success: true,
      message: "File uploaded",
      file: uploadedFile,
    });
  } catch (err) {
    console.log("error while uploading file", err);
    return next(new AppError(err.message || "Internal Server Error", 500)); 
  }
});

module.exports = router;
