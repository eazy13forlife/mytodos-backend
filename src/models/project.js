const mongoose = require("mongoose");

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

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
