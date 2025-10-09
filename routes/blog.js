const express = require("express");
const { auth, isAdmin } = require("../middlewares/Authorization");
const {
  createBlog,
  updateBlogs,
  deleteBlog,
  findAllBlogs,
  likeBLogs,
  commentOnBlog,
  updateComment,
  deleteComment,
  dislikeBlog,
  getBlogDetails,
} = require("../controllers/Blogs");
const { userBlogs } = require("../controllers/Profile");
const router = express.Router();

// blog crud operations
router.post("/create-blog", auth, isAdmin, createBlog);
router.put("/update-blog", auth, isAdmin, updateBlogs);
router.delete("/delete-blog/:blogId", auth, isAdmin, deleteBlog);
router.get("/get-all-blogs", findAllBlogs);
router.get("/user-blogs", auth, isAdmin, userBlogs);
router.get("/blog-details/:blogId", getBlogDetails);

// comment
router.post("/blog/:blogId/comment", auth, commentOnBlog);
router.put("/update-comment/:blogId", auth, updateComment);
router.delete("/delete-comment", auth, deleteComment);

// likes
router.post("/like-blog/:blogId", auth, likeBLogs);
router.post("/dislike-blog/:blogId", auth, dislikeBlog);

module.exports = router;
