const mongoose = require("mongoose");
const Category = require("../models/Category");
const AppError = require("../utils/appError");

// only for amin create category
exports.createCategory = async (req, res, next) => {
  try {
    let { categoryName, description } = req.body;

    // validation
    if (!categoryName || !description)
      return next(new AppError("All fields are required", 400));

    // sanitization
    categoryName = categoryName.toString().toLowerCase().trim();
    description = description.toString().trim();

    // find all category for only one category
    const existingCategory = await Category.findOne({
      categoryName: { $regex: `^${categoryName}$`, $options: "i" },
    });
    if (existingCategory)
      return next(
        new AppError(
          "We cannot create duplicate category",
          400,
          req.originalUrl
        )
      );

    // create entry in db
    const category = await Category.create({
      categoryName: categoryName,
      description: description,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "category created successfully",
    });
  } catch (err) {
    return next(new AppError(err.message, 500, req.originalUrl));
  }
};

// only for amin update category
exports.updateCategory = async (req, res, next) => {
  try {
    let { categoryId, categoryName, description } = req.body;

    if (categoryId.length !== 24)
      return next(new AppError("Category Id invalid", 400));

    // validation
    if (!categoryId || !categoryName || !description)
      return next(new AppError("All fields are required", 400));

    //sanitization
    categoryId = categoryId.toString().trim();
    categoryName = categoryName.toString().toLowerCase().trim();
    description = description.toString().trim();

    const duplicateCategory = await Category.findOne({
      categoryName: { $regex: `^${categoryName}$`, $options: "i" },
      _id: { $ne: categoryId },
    });
    if (duplicateCategory)
      return next(new AppError("We cannot update to duplicate category", 400));

    // find that category
    const category = await Category.findById(categoryId);
    if (!category) return next(new AppError("Category not found", 404));

    // agar category mil jata hai to
    category.categoryName = categoryName;
    category.description = description;

    const updatedCategory = await category.save();

    return res.status(200).json({
      success: true,
      message: "category updated successfully",
      data: updatedCategory,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// Delete category only for admin
exports.deleteCategory = async (req, res, next) => {
  try {
    let { categoryId } = req.body;

    //Validation
    if (!categoryId) return next(new AppError("Category id is required"));

    if (!mongoose.Types.ObjectId.isValid(categoryId))
      return next(new AppError("Category Id invalid", 400));

    // sanitize
    categoryId = categoryId.toString().trim();
    if (!categoryId) return next(new AppError("Category Id is required", 400));

    // find category
    const category = await Category.findById(categoryId);
    if (!category) return next(new AppError("Category not found", 404));

    // agar category mil gya to delete kr do
    await Category.findByIdAndDelete(categoryId);

    const allCategories = await Category.find().populate("blogs");
    
    return res.status(200).json({
      success: true,
      message: "category deleted successfully",
      data:allCategories
    });
  } catch (err) {
    return next(new AppError(err.message, 500, req.originalUrl));
  }
};

// Find all category
exports.allCategories = async (req, res, next) => {
  try {
    const allCategories = await Category.find().populate("blogs");

    return res.status(200).json({
      success: true,
      message:
        allCategories.length < 1
          ? "We have no category"
          : "All categories fetched successfully",
      data: allCategories,
    });
  } catch (err) {
    return next(new AppError(err.message, 500, req.originalUrl));
  }
};
