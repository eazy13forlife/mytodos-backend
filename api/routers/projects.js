const express = require("express");
const router = new express.Router();
const moment = require("moment");

const Project = require("../models/project.js");
const Task = require("../models/task.js");
const authenticateMiddleware = require("../middleware/authenticate.js");

router.post("/projects", authenticateMiddleware, async (req, res) => {
  try {
    const projectData = req.body;

    const project = new Project({ ...projectData, owner: req.user._id });

    const savedProject = await project.save();

    res.status(201).send(savedProject);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/projects/:id", authenticateMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;

    //make sure user is only changing correct fields
    const certifiedFields = ["title"];

    const updateData = req.body;

    const updateFields = Object.keys(req.body);

    for (let i = 0; i < updateFields.length; i++) {
      const field = updateFields[i];
      if (!certifiedFields.includes(field)) {
        return res
          .status(400)
          .send({ error: `${field} is not a valid field.` });
      }
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send();
    }

    //for each field user wants to change, update the field in the task doc
    updateFields.forEach((field) => {
      project[field] = updateData[field];
    });

    const savedProject = await project.save();

    res.send(savedProject);
  } catch (e) {
    res.status(404).send({ error: e.message });
  }
});

router.get("/projects/:id", authenticateMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      res.status(404).send();
    }

    res.send(project);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/projects", authenticateMiddleware, async (req, res) => {
  try {
    const allProjects = await Project.find({ owner: req.user._id });

    res.send(allProjects);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.get("/projects/:id/tasks", authenticateMiddleware, async (req, res) => {
  const match = {};
  const sort = {};
  const query = req.query;

  //populate match object
  Object.keys(query).forEach((queryKey) => {
    if (queryKey !== "sortBy") {
      match[queryKey] = query[queryKey];
    }
  });

  //fix today and upcoming dueDate in match object
  if (match.dueDate) {
    const todaysDate = moment().startOf("day").toISOString();

    if (match.dueDate === "today") {
      match.dueDate = todaysDate;
    } else if (match.dueDate === "upcoming") {
      match.dueDate = { $gt: todaysDate };
    }
  }

  //populate sort object
  if (query.sortBy) {
    const sortFields = query.sortBy.split("_");

    sortFields.forEach((field) => {
      const fieldArray = field.split(":");
      sort[fieldArray[0]] = fieldArray[1];
    });
  }

  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send();
    }

    const allTasks = await Task.find({
      project: project._id,
      //project: project.title,
      owner: req.user._id,
      ...match,
    }).sort(sort);

    res.send(allTasks);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.delete("/projects/:id", authenticateMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;

    const deletedTask = await Project.findOneAndDelete({
      _id: projectId,
      owner: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).send();
    }

    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
