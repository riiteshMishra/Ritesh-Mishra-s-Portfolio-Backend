const express = require("express");
const router = express.Router();
const { auth, isClient, isAdmin } = require("../middlewares/Authorization");
const {
  CreateReview,
  toggleReview,
  updateReview,
  deleteReview,
  getAllReviews,
  nonApproved,
} = require("../controllers/Review");

router.post("/create-review", auth, isClient, CreateReview);
router.post("/toggle-review", auth, isAdmin, toggleReview);
router.post("/update-review", auth, isClient, updateReview);
router.post("/delete-review", auth, isAdmin, deleteReview);
router.get("/get-all-reviews", getAllReviews);
router.post("/get-non-approved-reviews", auth, isAdmin, nonApproved);

module.exports = router;
