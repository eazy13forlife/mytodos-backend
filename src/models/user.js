const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
});

//create virtual field for tasks, notes and projects so we can populate all the tasks,notes and projects for a specific user easier
userSchema.virtual("tasks", {
  ref: "Task",
  foreignField: "owner",
  localField: "_id",
});

userSchema.virtual("notes", {
  ref: "Note",
  foreignField: "owner",
  localField: "_id",
});

userSchema.virtual("projects", {
  ref: "Project",
  foreignField: "owner",
  localField: "_id",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
