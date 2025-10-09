const { default: mongoose } = require("mongoose");
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
    if (!title || !slug || !content || !categoryId || !tags)
      return next(new AppError("All fields are required"));

    // Thumbnail
    let { thumbnail } = req.files;
    if (!thumbnail) return next(new AppError("Thumbnail is required", 400));
    thumbnail = await uploadFileToCloudinary(thumbnail);

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
      thumbnail: thumbnail.url,
    });

    // update category
    await Category.findByIdAndUpdate(
      category._id,
      {
        $push: { blogs: blog._id },
      },
      { new: true }
    );

    // user ke blogs array me blog ki id push
    user.blogs.push(blog._id);
    await user.save();
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
    const { blogId, title, slug, content, categoryId, tags, isPublished } =
      req.body;

    if (!blogId) return next(new AppError("Blog id required", 400));

    // Find blog
    let blog = await Blog.findById(blogId);
    if (!blog) return next(new AppError("Blog not found", 404));

    // Update only provided fields
    if (title) blog.title = title.toString().trim();
    if (slug) blog.slug = slug.toString().toLowerCase().trim();
    if (content) blog.content = content.toString().trim();
    if (categoryId) blog.category = categoryId.toString().trim();
    if (isPublished) blog.isPublished = isPublished;
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
    if (!mongoose.Types.ObjectId.isValid(blogId))
      return next("Invalid blog id", 400);

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
    const allBlogs = await Blog.find({ isPublished: true }).populate(
      "author",
      "name email"
    );

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

// blog like
exports.likeBLogs = async (req, res, next) => {
  try {
    // data fetch
    const { blogId } = req.params;
    const userId = req.user.id;

    // blog id validation
    if (!mongoose.Types.ObjectId.isValid(blogId))
      return next(new AppError("Invalid blogId", 400));

    // validation
    if (!userId) return next(new AppError("User id not found", 400));

    // find that blog and user in db
    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId);

    if (!blog) return next(new AppError("Blog not found.", 404));
    if (!user) return next(new AppError("User not found", 404));

    // update blog likes
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $addToSet: { likes: userId },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Liked successfully",
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// dislike blog
exports.dislikeBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    // object id validation
    if (!mongoose.Types.ObjectId.isValid(blogId))
      return next(new AppError("Invalid blog id"));
    if (!mongoose.Types.ObjectId.isValid(userId))
      return next(new AppError("Invalid user id"));

    // find that blog and user by id
    const user = await User.findById(userId);
    const blog = await Blog.findById(blogId);

    if (!user) return next(new AppError("User not found", 404));
    if (!blog) return next(new AppError("Blog not found", 404));

    // dislike that blog
    await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { likes: userId } },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Like removed",
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// comment on blog
exports.commentOnBlog = async (req, res, next) => {
  try {
    // data fetch
    const { blogId } = req.params;
    let { commentText } = req.body;
    const userId = req.user.id;

    console.log("req.body :", req.body);
    console.log("req.user", req.user.id);

    //validation
    if (!userId) return next(new AppError("User id not found", 400));
    if (!mongoose.Types.ObjectId.isValid(blogId))
      return next(new AppError("Invalid blogId", 400));

    if (!commentText)
      return next(new AppError("Please send us your comment.", 400));

    // find that blog and user in db
    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId);

    if (!blog) return next(new AppError("Blog not found", 404));
    if (!user) return next(new AppError("User not found", 404));

    // agar comment pahale se hai
    const alreadyCommented = await Blog.findOne({
      _id: blogId,
      "comments.user": userId,
    });

    if (alreadyCommented)
      return next(
        new AppError("This blog is already commented by this user", 400)
      );
    // update blog comments field
    const commentAddedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $addToSet: { comments: { user: userId, text: commentText } },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Comment Added",
      commentAddedBlog,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// update comment
exports.updateComment = async (req, res, next) => {
  try {
    // fetch data
    let { commentText } = req.body;
    const userId = req.user.id;
    const { blogId } = req.params;

    // sanitization
    commentText = commentText.toString().trim();

    // object id validation
    if (!mongoose.Types.ObjectId.isValid(userId))
      return next(new AppError("Invalid user id", 400));
    if (!mongoose.Types.ObjectId.isValid(blogId))
      return next(new AppError("Invalid blog id"));

    // validation
    if (!commentText)
      return next(new AppError("Comment text is required", 400));

    // update comment
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blogId, "comments.user": userId },
      { $set: { "comments.$.text": commentText } },
      { new: true }
    );

    if (!updatedBlog) {
      return next(
        new AppError("No comment found for this user on this blog", 404)
      );
    }

    return res.status(200).json({
      success: true,
      message: "Comment Updated ",
      updatedBlog,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// delete comment
exports.deleteComment = async (req, res, next) => {
  try {
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
