const Projects = require("../models/Projects");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { uploadFileToCloudinary } = require("../utils/fileUploader");

// create project
exports.createProject = async (req, res, next) => {
  try {
    // console.log(" Incoming project data:", req.body);

    const userId = req.user.id;
    if (!userId || userId.length !== 24) {
      return next(new AppError("User id not found or invalid user Id", 400));
    }

    let {
      projectName,
      description,
      gitHubLink,
      liveLink,
      frontendTech,
      backendTech,
    } = req.body;

    // thumbnail required check
    if (!req.files || !req.files.thumbnail) {
      return next(new AppError("Thumbnail is required", 400));
    }
    let { thumbnail } = req.files;

    //  user validation
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    //  required fields
    if (!projectName || !description || !gitHubLink || !thumbnail) {
      return next(new AppError("All fields are required", 400));
    }

    thumbnail = (await uploadFileToCloudinary(thumbnail)).url;
    if (!thumbnail) return next(new AppError("thumbnail upload failed", 499));
    //  sanitization
    projectName = projectName.toString().toLowerCase().trim();
    description = description.toString().trim();
    gitHubLink = gitHubLink.toString().trim();
    liveLink = liveLink ? liveLink.toString().trim() : null;

    const project = await Projects.create({
      projectName,
      description,
      gitHubLink,
      liveLink,
      frontendTech,
      backendTech,
      thumbnail,
      createdBy: user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// delete project
exports.deleteProject = async (req, res, next) => {
  try {
    //find admin id
    const userId = req.user.id;
    if (!userId || userId.length !== 24)
      return next(new AppError("User id not found or invalid user Id", 400));

    // find project id
    const Id = req.params.projectId;
    //     console.log("Project id...........", Id);
    if (!Id || Id.length !== 24)
      return next(new AppError("Project id not found or invalid id", 400));

    //find project by id
    const project = await Projects.findById(Id);
    if (!project) return next(new AppError("Invalid project id"));

    // find admin by id
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 400));

    //check
    if (project.createdBy.toString() !== userId)
      return next(
        new AppError("You are not authorized to delete this project", 403)
      );

    await Projects.findByIdAndDelete(project._id);
    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// update project
exports.updateProject = async (req, res, next) => {
  try {
    // data fetch
    let {
      projectName,
      description,
      frontendTech,
      backendTech,
      gitHubLink,
      liveLink,
    } = req.body;

    // if thumbnail available
    let thumbnail;
    if (req.files && req.files.thumbnail) {
      const uploaded = await uploadFileToCloudinary(req.files.thumbnail);
      thumbnail = uploaded.url;
    }
    //find admin id
    const userId = req.user.id;
    if (!userId || userId.length !== 24)
      return next(new AppError("User id not found or invalid user Id", 400));

    // find project id
    const { projectId } = req.params;
    if (!projectId || projectId.length !== 24)
      return next(new AppError("Project id not found or invalid id", 400));

    // find project by id
    const project = await Projects.findById(projectId);
    if (!project)
      return next(new AppError("Project not found by the given id"));

    // authorized user or not
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    // check
    if (project.createdBy.toString() !== userId) {
      return next(
        new AppError("You're not authorized to update this project", 403)
      );
    }

    // Update only provided fields
    if (projectName)
      project.projectName = projectName.toString().toLowerCase().trim();
    if (description) project.description = description.toString().trim();
    if (thumbnail) project.thumbnail = thumbnail;
    if (frontendTech) project.frontendTech = frontendTech;
    if (backendTech) project.backendTech = backendTech;
    if (gitHubLink) project.gitHubLink = gitHubLink.trim();
    if (liveLink) project.liveLink = liveLink.trim();

    await project.save();
    console.log("given variables", req.body);
    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      project,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// get all projects
exports.getAllProjects = async (req, res, next) => {
  try {
    const allProjects = await Projects.find();

    const message =
      allProjects.length === 0
        ? "You have not created any project yet"
        : "All projects fetched successfully";

    return res.status(200).json({
      success: true,
      message,
      data: allProjects,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
