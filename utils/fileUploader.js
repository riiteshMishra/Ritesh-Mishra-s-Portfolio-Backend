require("dotenv").config();
const cloudinary = require("../config/cloudinary");
const cloudFolder = process.env.CLOUDINARY_FOLDER;

exports.uploadFileToCloudinary = async (file, path, quality) => {
  try {
    const options = {
      folder: path ? `${cloudFolder}/${path}` : cloudFolder,
      resource_type: "auto",
      unique_filename: false,
      overwrite: true,
      // use_filename: true,
      transformation: [{ quality: quality || "auto", fetch_format: "auto" }],
    };

    const response = await cloudinary.uploader.upload(
      file.tempFilePath,
      options,
    );
    return {
      success: true,
      message: "File uploaded successfully",
      url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (err) {
    console.error("Image Upload error:", err);

    return {
      success: false,
      message: "File upload failed",
      error: err.message,
      path: "./utils/fileUploader",
    };
  }
};

exports.destroyMedia = async (url) => {
  try {
    if (!url) return null;

    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const publicPath = url.substring(uploadIndex + 8); // after /upload/
    const withoutVersion = publicPath.split("/").slice(1).join("/");
    const publicId = withoutVersion.split(".")[0];
    console.log("public id", publicId);
    // const result = await cloudinary.uploader.destroy(publicId);
    const result = "hi";
    return result;
  } catch (err) {
    console.error("Destroy Media Error:", err);
    return null;
  }
};
