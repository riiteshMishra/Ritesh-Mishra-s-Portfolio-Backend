const express = require("express");
const { auth, isAdmin } = require("../middlewares/Authorization");
const {
  createProject,
  deleteProject,
  updateProject,
  getAllProjects,
} = require("../controllers/Projects");
const router = express.Router();

router.post("/create-project", auth, isAdmin, createProject);
router.put("/update-project/:projectId", auth, isAdmin, updateProject);
router.delete("/delete-project/:projectId", auth, isAdmin, deleteProject);
router.get("/get-all-projects", getAllProjects);
module.exports = router;
