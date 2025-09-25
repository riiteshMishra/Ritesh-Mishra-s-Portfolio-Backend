const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  allCategories,
} = require("../controllers/Category");
const { isAdmin, auth } = require("../middlewares/Authorization");
const router = express.Router();

// create category only of amin
router.post("/create-category", auth, isAdmin, createCategory);
router.post("/update-category", auth, isAdmin, updateCategory);
router.post("/delete-category", auth, isAdmin, deleteCategory);
router.get("/find-all-categories", allCategories);


module.exports = router;
