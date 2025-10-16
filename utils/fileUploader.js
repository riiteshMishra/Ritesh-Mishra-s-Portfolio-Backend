require("dotenv").config();
const cloudinary = require("../config/cloudinary");
const cloudFolder = process.env.CLOUDINARY_FOLDER;

exports.uploadFileToCloudinary = async (file, quality) => {
  try {
    const options = {
      folder: cloudFolder,
      resource_type: "auto",
      unique_filename: false,
      overwrite: true,
      // use_filename: true,
      transformation: [{ quality: quality || "auto", fetch_format: "auto" }],
    };

    const response = await cloudinary.uploader.upload(
      file.tempFilePath,
      options
    );
    return {
      success: true,
      message: "File uploaded successfully",
      url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (err) {
    console.error("Upload error:", err);

    return {
      success: false,
      message: "File upload failed",
      error: err.message,
      path: "./utils/fileUploader",
    };
  }
};
