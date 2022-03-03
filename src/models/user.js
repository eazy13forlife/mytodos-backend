const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Task = require("../models/task.js");
const Note = require("../models/note.js");
const Project = require("../models/project.js");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

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

//before we delete a user, remove all their tasks, notes and projects from database
userSchema.pre(
  "deleteOne",
  { query: false, document: true },
  async function () {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    await Note.deleteMany({ owner: user._id });
    await Project.deleteMany({ owner: user._id });
  }
);

//hash user's password before saving user document
userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    //create hashed password
    const hashedPass = await bcrypt.hash(user.password, 10);
    //save hashedPassword as user's new password
    user.password = hashedPass;
  }
});

//when toStringify is called on our doc, remove the password and token fields from user's document
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

//generates an authentication token and adds to user's token array
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  //create an auth token with user's id as the payload
  const token = await jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET
  );

  user.tokens = [...user.tokens, { token }];
  //we want to send the token back to the user so they have it
  return token;
};

userSchema.methods.verifyPassword = async function (currentPassword) {
  const user = this;

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("Password does not match");
  }

  return true;
};

//checks a user's email and password when they login to see if valid.
userSchema.statics.validateCredentials = async function (email, password) {
  //"this" refers to the model
  const User = this;
  //find user with email provided
  const user = await this.findOne({ email: email });
  //check if password user provided matches with the hashed password saved for user
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    return user;
  } else {
    throw new Error("Unable to login");
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
