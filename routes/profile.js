const express = require("express");
const AppError = require("../utils/appError");
const createRateLimiter = require("../utils/rateLimiter");

// 3 requests per minute
const sectionLimiter = createRateLimiter({ max: 3 });

// 10 requests per minute
// const generalLimiter = createRateLimiter({ max: 10 });

const {
  updateProfile,
  deleteAccount,
  findAllUsers,
  getUserDetails,
  updatePicture,
} = require("../controllers/Profile");
const { auth, isAdmin } = require("../middlewares/Authorization");
const {
  contactUs,
  getAllRequests,
  updateStatus,
  deleteRequests,
} = require("../controllers/Contact-us");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
const {
  createSection,
  updateSection,
  deleteSection,
  getSectionById,
  getAllSectionsByBlog,
} = require("../controllers/BlogSection");
const router = express.Router();

router.post("/update-profile", auth, updateProfile);
router.delete("/delete-account", auth, deleteAccount);
router.get("/find-all-clients", auth, isAdmin, findAllUsers);
router.get("/get-user-details", auth, getUserDetails);
router.post("/update-profile-picture", auth, updatePicture);

// contact us form
router.post("/create-request", contactUs);
router.get("/client-requests", auth, isAdmin, getAllRequests);
router.post("/form-status-update", auth, isAdmin, updateStatus);
router.post("/delete-requests", auth, isAdmin, deleteRequests);

// SECTION
router.post("/create-section", auth, isAdmin, sectionLimiter, createSection);
router.post("/update-section", auth, isAdmin, sectionLimiter, updateSection);
router.delete(
  "/delete-section/:sectionId",
  auth,
  isAdmin,
  sectionLimiter,
  deleteSection,
);
router.get(
  "/section/:sectionId",
  auth,
  isAdmin,
  sectionLimiter,
  getSectionById,
);
router.get(
  "/sections/:blogId",
  auth,
  isAdmin,
  sectionLimiter,
  getAllSectionsByBlog,
);

// SUB-SECTION

// local file upload and get cloud link
router.post("/upload-file", auth, isAdmin, async (req, res, next) => {
  try {
    const file = req.files?.file;
    if (!file) {
      return next(new AppError("File must be required", 400));
    }

    // Upload file to Cloudinary
    const uploadedFile = await uploadFileToCloudinary(file);
    console.log("uploaded file", uploadedFile);

    if (!uploadedFile.success)
      return next(new AppError("file upload failed ", 400));
    // Send response
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      uploadFile: uploadedFile?.url,
    });
  } catch (err) {
    console.error("Error while uploading file:", err);
    return next(new AppError(err.message || "File upload failed", 500));
  }
});

module.exports = router;
