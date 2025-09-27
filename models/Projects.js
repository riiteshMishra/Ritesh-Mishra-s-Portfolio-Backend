const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      required: true,
      maxLength: 400,
    },

    gitHubLink: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"],
    },

    liveLink: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"],
    },

    frontendTech: {
      type: [String],
      set: (arr) => arr.map((t) => t.toLowerCase()),
      default: [],
    },

    backendTech: {
      type: [String],
      set: (arr) => arr.map((t) => t.toLowerCase()),
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    thumbnail: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"],
    },
  },
  { timestamps: true }
);

const Projects = mongoose.model("Projects", projectSchema);
module.exports = Projects;
