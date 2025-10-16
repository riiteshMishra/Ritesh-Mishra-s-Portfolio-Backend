const express = require("express");
const { auth, isAdmin } = require("../middlewares/Authorization");
const AppError = require("../utils/appError");
const router = express.Router();

router.post("/upload-file", auth, isAdmin, (req, res, next) => {
  try {
    const { file } = req.files;


    return res.status(200).json({
      success: true,
      message: "file uploaded",
      file
    });
  } catch (err) {
    console.log("error while uploading file", err);
    return next(new AppError(err.message, 500));
  }
});

module.exports = router;
