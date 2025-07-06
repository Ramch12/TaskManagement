const express = require("express");
const { validate } = require("../middleware/schameValidate");
const taskSchema = require("../validate/taskValidation");
const taskController = require("../controller/taskController");
const { authentication } = require("../middleware/authentication");

const taskRoute = express.Router();

taskRoute.get("/get/:id", authentication, taskController.getTaskById);
taskRoute.get("/getAlltask", authentication, taskController.getTasks);

taskRoute.post(
  "/create",
  authentication,
  validate(taskSchema.createTaskSchema),
  taskController.createTask
);

taskRoute.put(
  "/update/:id",
  authentication,
  validate(taskSchema.updateTaskSchema),
  taskController.updateTask
);
taskRoute.delete("/delete/:id", authentication, taskController.deleteTask);

module.exports = { taskRoute };
