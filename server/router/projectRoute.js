const express = require("express");
const { validate } = require("../middleware/schameValidate");
const projectSchema = require("../validate/projectValidation");
const projectController = require("../controller/ProjectController");
const { authentication } = require("../middleware/authentication");

const projectRoute = express.Router();

projectRoute.get(
  "/getProject/:id",
  authentication,
  projectController.getProjectById
);
projectRoute.get(
  "/getAllProject",
  authentication,
  projectController.getProjects
);

projectRoute.post(
  "/create",
  authentication,
  validate(projectSchema.createProjectSchema),
  projectController.createProject
);

projectRoute.put(
  "/update/:id",
  authentication,
  validate(projectSchema.updateProjectSchema),
  projectController.updateProject
);
projectRoute.delete("/delete/:id", authentication, projectController.deleteProject);
projectRoute.get("/getProjectWithTask/:id", projectController.getProjectWithTask);

module.exports = {projectRoute};
