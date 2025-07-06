const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["todo", "in-progress", "done"],
  },
  dueDate: {
    type: Date,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

taskSchema.plugin(mongoosePaginate)

const Task = mongoose.model("Task", taskSchema);
module.exports = {
  Task,
};
