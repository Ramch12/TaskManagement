const { Project } = require("../models/project");
const mongoose = require("mongoose");

const createProject = async (data, userId) => {
  return await Project.create({ ...data, createdBy: userId });
};

const getUserProjects = async (userId, options) => {
  return await Project.paginate({ createdBy: userId }, options);
};

const getProjectById = async (projectId) => {
  return await Project.findById(projectId);
};

const updateProject = async (projectId, updateData) => {
  return await Project.findByIdAndUpdate(projectId, updateData, { new: true });
};

const deleteProject = async (projectId) => {
  return await Project.findByIdAndDelete(projectId);
};

const getProjectWithTask = async (projectId) => {
  const result = await Project.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "projectId",
        as: "Task",
      },
    },
  ]);
  return result;
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectWithTask,
};
