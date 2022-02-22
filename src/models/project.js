const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
