const mongoose = require("mongoose");
const Task = require("../models/task.js");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

projectSchema.virtual("tasks", {
  ref: "Task",
  foreignField: "projectOwner",
  localField: "_id",
});

//before we delete a project, update all tasks that have this project attached to it
projectSchema.pre("findOneAndDelete", async function () {
  //we need the projects name and we find it via the id we provided
  const project = await Project.findById(this.getQuery()._id);

  //get all tasks that have its project name as the one we are deleting and set its value to undefined
  const allTasks = await Task.updateMany(
    { project: project.title },
    { project: undefined }
  );
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
