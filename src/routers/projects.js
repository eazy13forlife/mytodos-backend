const express = require("express");
const router = new express.Router();
const moment = require("moment");

const Project = require("..//models/project.js");
const Task = require("../models/task.js");
const authenticateMiddleware = require("../middleware/authenticate.js");

router.post("/projects", authenticateMiddleware, async (req, res) => {
  try {
    const projectData = req.body;

    const project = new Project({ ...projectData, owner: req.user._id });

    const savedProject = await project.save();

    res.status(201).send(savedProject);
  } catch (e) {
    res.status(400).send({ error: e.message });
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

  //populate sort object
  if (query.sortBy) {
    const sortFields = query.sortBy.split("_");

    sortFields.forEach((field) => {
      const fieldArray = field.split(":");
      sort[fieldArray[0]] = fieldArray[1];
    });
  }

  //fix today and upcoming dueDate in sort object
  if (sort.dueDate) {
    const todaysDate = moment().startOf("day").toISOString();

    if (sort.dueDate === "today") {
      sort.dueDate = todaysDate;
    } else if (sort.dueDate === "upcoming") {
      sort.dueDate = { $gt: todaysDate };
    }
  }

  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send();
    }

    const allTasks = await Task.find({
      project: project.title,
      owner: req.user._id,
      ...match,
    }).sort(sort);

    res.send(allTasks);
  } catch {
    res.status(500).send();
  }
});

router.delete("/projects/:id", authenticateMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;

    await Project.findOneAndDelete({ _id: projectId });

    res.send();
  } catch (e) {
    res.status(500).send({ e: e.message });
  }
});

module.exports = router;
