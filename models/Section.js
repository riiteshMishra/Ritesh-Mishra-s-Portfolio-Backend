const mongoose = require("mongoose");


const sectionSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    title: {
      type: String,
      maxLength: 70,
      trim: true,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      maxLength: 150,
      trim: true,
      lowercase: true,
      required: true,
    },
    content: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SubSection",
      },
    ],
  },
  { timestamps: true }
);

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
