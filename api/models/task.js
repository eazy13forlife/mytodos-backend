const mongoose = require("mongoose");
const validator = require("validator");
const formatDate = require("../helperFunctions/dates.js");
const moment = require("moment");

//validator for my date field.Takes in date in unix.
const dateValidation = (date) => {
  //if no date is provided, that is fine

  if (!date) {
    return true;
  }

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
      maxLength: [500, "Title must not be greater than 500 characters"],
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
      //type: String,
      type: mongoose.Schema.Types.ObjectId,
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

//before we save a task, if completed field is modified adjust user.tasksCompleted appropriately
taskSchema.pre("save", async function () {
  const task = this;

  if (task.isModified("completed")) {
    const user = await mongoose.model("User").findById(task.owner);
    //if task is now completed, increment user.taskCompleted
    if (task.completed) {
      /*
      await user.update(
        { $inc: { tasksCompleted: 1 } },
        { runValidators: true }
      );
*/

      user.tasksCompleted += 1;
      //else if task was modified and now not completed decrement tasksCompleted. But initially completed will be set to false,which counts as modified, so in this case, we don't want to do anything. This corresponds with tasksCompleted equaling 0, falsy. This won't work because when i first create task value is set to false, so this will decrement it automatically.
    }

    //we only want to validate modified field. Everything else would have been validated
    await user.save({ validateModifiedOnly: true });
  }
});

//convert our dueDate to an ISOString before saving in our document
taskSchema.pre("save", function () {
  const task = this;
  task.dueDate = moment(task.dueDate, "MM-DD-YYYY").toISOString();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
