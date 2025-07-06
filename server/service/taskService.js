const { Task } = require("../models/task");
const mongoose = require("mongoose");

const createTask = async (data, createdBy) => {
  const payload = { createdBy, ...data };
  return await Task.create(payload);
};

const getAllTasks = async (query, userId) => {
  const { status, projectId, page=1, limit=10 } = query;
  let filter = projectId
    ? { projectId: new mongoose.Types.ObjectId(projectId) }
    : {};
  filter = status ? { ...filter, status, createdBy:userId } : { ...filter, createdBy:userId };
  return await Task.paginate(filter, {page, limit});
};

const getTaskById = async (taskId) => {
  return await Task.findById(taskId);
};

const updateTask = async (taskId, updateData) => {
  return await Task.findByIdAndUpdate(taskId, updateData, { new: true });
};

const deleteTask = async (taskId) => {
  await Task.findByIdAndDelete(taskId);
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
