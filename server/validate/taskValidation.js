const Joi = require("joi");
const mongoose = require("mongoose");

const createTaskSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  status: Joi.string().valid("todo", "in-progress", "done").required(),
  dueDate: Joi.date().required(),
  projectId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/, "object Id"),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  status: Joi.string().valid("todo", "in-progress", "done"),
  dueDate: Joi.date(),
  projectId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/, "object Id"),

});

const taskIdParamSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid task ID");
      }
      return value;
    })
    .required(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
};
