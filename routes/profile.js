const express = require("express");
const {
  updateProfile,
  deleteAccount,
  findAllUsers,
  getUserDetails,
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

// contact us form
router.post("/create-request", contactUs);
router.get("/client-requests", auth, isAdmin, getAllRequests);
router.post("/form-status-update", auth, isAdmin, updateStatus);
module.exports = router;
