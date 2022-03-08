const mongoose = require("mongoose");
const validator = require("validator");
const formatDate = require("../helperFunctions/dates.js");
const moment = require("moment");

//validator for my date field.Takes in date in unix.
const dateValidation = (date) => {
  if (
    !validator.isDate(date, {
      format: "MM-DD-YYYY",
      delimiters: ["/", "-"],
    })
  ) {
    throw new Error("Invalid date format");
  }

  const todaysDateParsed = moment().startOf("day").valueOf();

  const specifiedDateParsed = moment(date, "MM-DD-YYYY").valueOf();

  if (moment(specifiedDateParsed).isBefore(todaysDateParsed)) {
    throw new Error("Date cannot be before today");
  }
};

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: String,
      validate: dateValidation,
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

//convert our dueDate to an ISOString before saving in our document
taskSchema.pre("save", function () {
  const task = this;
  console.log("dad");
  task.dueDate = moment(task.dueDate, "MM-DD-YYYY").toISOString();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
