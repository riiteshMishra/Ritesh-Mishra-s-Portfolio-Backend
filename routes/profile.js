const express = require("express");
const AppError = require("../utils/appError");

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
} = require("../controllers/Contact-us");
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

// local file upload and get cloud link
router.post("/upload-file", auth, isAdmin, (req, res, next) => {
  try {
    const { file } = req.files;

    return res.status(200).json({
      success: true,
      message: "file uploaded",
      file,
    });
  } catch (err) {
    console.log("error while uploading file", err);
    return next(new AppError(err.message, 500));
  }
});

module.exports = router;
