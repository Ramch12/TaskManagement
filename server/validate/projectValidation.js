const Joi = require("joi");
const mongoose = require("mongoose");

const createProjectSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  status: Joi.string().valid("active", "completed").required()
});

const updateProjectSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  status: Joi.string().valid("active", "completed"),
});

const projectIdParamSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid project ID");
      }
      return value;
    })
    .required(),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
};
