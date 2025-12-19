const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "video", "code", "list"],
      required: true,
    },

    title: {
      type: String,
      trim: true,
    },

    text: {
      type: String,
      trim: true,
    },

    imageUrl: {
      type: String,
    },

    videoUrl: {
      type: String,
    },

    code: {
      type: String,
    },

    listItems: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubSection", SubSectionSchema);
