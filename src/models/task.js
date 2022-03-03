const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
      trim: true,
      validate(date) {
        if (Date.parse(date) < Date.now()) {
          throw new Error("Due date cannot be before today");
        }
      },
    },
    priority: {
      type: String,
    },
    project: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
