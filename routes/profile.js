const express = require("express");
const {
  updateProfile,
  deleteAccount,
  findAllUsers,
  getUserDetails,
} = require("../controllers/Profile");
const { auth, isAdmin } = require("../middlewares/Authorization");
const router = express.Router();

router.post("/update-profile", auth, updateProfile);
router.delete("/delete-account", auth, deleteAccount);
router.get("/find-all-clients", auth, isAdmin, findAllUsers);
router.get("/get-user-details", auth, getUserDetails);
module.exports = router;
