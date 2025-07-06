const handleCatchAsync = require("../helpers/catchAsynHandler");
const taskService = require("../service/taskService");
const { HTTP_STATUS, sendResponse } = require("../utils/message");

const createTask = handleCatchAsync(async (req, res) => {
  const createdBy = req.user._id
  const task = await taskService.createTask(req.body, createdBy);
  return sendResponse({ res, statusCode: HTTP_STATUS.CREATED, task });
});

const getTasks = handleCatchAsync(async (req, res) => {
  const query = req.query;
  const userId = req.user._id
  const tasks = await taskService.getAllTasks(query, userId); // optional filter
  return sendResponse({ res, statusCode: HTTP_STATUS.OK, tasks });
});

const getTaskById = handleCatchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  return sendResponse({ res, statusCode: HTTP_STATUS.OK, task });
});

const updateTask = handleCatchAsync(async (req, res) => {
  const updated = await taskService.updateTask(req.params.id, req.body);
  return sendResponse({ res, statusCode: HTTP_STATUS.OK, task: updated });
});

const deleteTask = handleCatchAsync(async (req, res) => {
  await taskService.deleteTask(req.params.id);
  return sendResponse({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Deleted successfully",
    status:true
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
