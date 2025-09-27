const express = require("express");
const { auth, isAdmin } = require("../middlewares/Authorization");
const {
  createBlog,
  updateBlogs,
  deleteBlog,
  findAllBlogs,
} = require("../controllers/Blogs");
const router = express.Router();

router.post("/create-blog", auth, isAdmin, createBlog);
router.put("/update-blog", auth, isAdmin, updateBlogs);
router.delete("/delete-blog", auth, isAdmin, deleteBlog);
router.get("/get-all-blogs", findAllBlogs);

module.exports = router;
