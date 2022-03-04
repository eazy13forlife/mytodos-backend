const mongoose = require("mongoose");
const validator = require("validator");
const formatDate = require("../helperFunctions/dates.js");
const moment = require("moment");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: String,
      trim: true,
      validate(date) {
        const valid = validator.isDate(date, {
          format: "MM-DD-YYYY",
          delimiters: ["/", "-"],
        });

        if (!valid) {
          throw new Error("Invalid date");
        }

        const todaysDate = moment().format("YYYY-MM-DD");
        const specifiedDate = formatDate(date);

        if (moment(specifiedDate).isBefore(todaysDate)) {
          throw new Error("Date cannot be before today");
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

//change dueDate to a unix timestamp before we save a task. Our validators are run first by the way and then this is run before officially saving.
taskSchema.pre("save", function () {
  const task = this;

  if (task.isModified("dueDate")) {
    const originalDueDate = task.dueDate;

    const newDateString = formatDate(originalDueDate);

    task.dueDate = moment(newDateString).valueOf();
  }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
