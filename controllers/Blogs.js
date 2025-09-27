const Blog = require("../models/Blogs");
const Category = require("../models/Category");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { uploadFileToCloudinary } = require("../utils/fileUploader");

// create blogs
exports.createBlog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return next(new AppError("Unauthorized access, user not found"));
    let { title, slug, content, categoryId, tags, isPublished } = req.body;
    console.log("REQ.BODY", req.body);
    //validation
    if (!title || !slug || !content || !categoryId)
      return next(new AppError("All fields are required"));

    // Thumbnail
    let { thumbnail } = req.files;
    if (!thumbnail) return next(new AppError("Thumbnail is required", 400));
    thumbnail = await uploadFileToCloudinary(thumbnail).url;

    // input data sanitize
    title = title.toString().toLowerCase().trim();
    slug = slug.toString().toLowerCase().trim();
    content = content.toString().trim();
    categoryId = categoryId.toString().trim();

    // Tags processing
    if (Array.isArray(tags)) {
      tags = tags.map((t) => t.toLowerCase().trim());
    } else if (typeof tags === "string") {
      tags = tags.split(",").map((t) => t.toLowerCase().trim());
    } else {
      tags = [];
    }

    // category ke andar is blog ka id push krna hai
    const category = await Category.findById(categoryId);
    if (!category) return next(new AppError("Could not found category."));

    // blog create krna hai
    const blog = await Blog.create({
      title: title,
      slug: slug,
      content: content,
      category: categoryId,
      tags: tags,
      isPublished: isPublished,
      author: user._id,
      thumbnail: thumbnail,
    });

    // update category
    await Category.findByIdAndUpdate(
      category._id,
      {
        $push: { blogs: blog._id },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// update blog
exports.updateBlogs = async (req, res, next) => {
  try {
    // console.log("REQ.BODY", req.body);
    if (!req.user.id) return next(new AppError("Unauthorized user not found"));
    const { blogId, title, slug, content, categoryId, tags } = req.body;

    if (!blogId) return next(new AppError("Blog id required", 400));

    // Find blog
    let blog = await Blog.findById(blogId);
    if (!blog) return next(new AppError("Blog not found", 404));

    // Update only provided fields
    if (title) blog.title = title.toString().trim();
    if (slug) blog.slug = slug.toString().toLowerCase().trim();
    if (content) blog.content = content.toString().trim();
    if (categoryId) blog.category = categoryId.toString().trim();

    if (tags) {
      if (Array.isArray(tags)) {
        blog.tags = tags.map((t) => t.toLowerCase().trim());
      } else if (typeof tags === "string") {
        blog.tags = tags.split(",").map((t) => t.toLowerCase().trim());
      } else {
        blog.tags = [];
      }
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// delete blog
exports.deleteBlog = async (req, res, next) => {
  try {
    // fetch data
    const { blogId } = req.params;
    if (!blogId) return next(new AppError("Blog id is required"));

    //validation
    if (!blogId || blogId.length !== 24)
      return next(new AppError("Valid Blog id is required", 400));

    //find blog
    const blog = await Blog.findById(blogId);
    if (!blog) return next(new AppError("Blog not found"));

    // is blog ko us category se pull kr do
    if (blog.category) {
      await Category.findByIdAndUpdate(
        blog.category,
        { $pull: { blogs: blog._id } },
        { new: true }
      );
    }

    // delete blog
    await Blog.findByIdAndDelete(blogId);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// find all blogs
exports.findAllBlogs = async (req, res, next) => {
  try {
    const allBlogs = await Blog.find().populate("author", "name email");

    if (allBlogs.length === 0)
      return next(new AppError("Currently we don't have any blog", 404));

    return res.status(200).json({
      success: true,
      message: "All blogs fetched successfully",
      allBlogs,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
