const handleCatchAsync = require("../helpers/catchAsynHandler");
const projectService = require("../service/projectService");
const { HTTP_STATUS, sendResponse } = require("../utils/message");

const createProject = handleCatchAsync(async (req, res) => {
  const userId = req.user._id;
  const project = await projectService.createProject(req.body, userId);
  return sendResponse({ res, statusCode: HTTP_STATUS.CREATED, project });
});

const getProjects = handleCatchAsync(async (req, res) => {
  const {page=1, limit=10 } = req.query;
  const projects = await projectService.getUserProjects(req.user._id, {page, limit});
  return sendResponse({ res, statusCode: HTTP_STATUS.OK, projects });
});

const getProjectById = handleCatchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  return sendResponse({ res, statusCode: HTTP_STATUS.OK, project });
});

const updateProject = handleCatchAsync(async (req, res) => {
  const updated = await projectService.updateProject(req.params.id, req.body);
  return sendResponse({ res, statusCode: HTTP_STATUS.OK, project: updated });
});

const deleteProject = handleCatchAsync(async (req, res) => {
  const data = await projectService.deleteProject(req.params.id);
  return sendResponse({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Deleted successfully",
    data,
  });
});

const getProjectWithTask = handleCatchAsync(async (req, res) => {
  const data = await projectService.getProjectWithTask(req.params.id);
  return sendResponse({
    res,
    statusCode: HTTP_STATUS.ACCEPTED,
    message: "Project with task fetched successfully",
    data,
  });
});


module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectWithTask
};
