const express = require("express");
const router = new express.Router();

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
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send();
    }

    const allTasks = await Task.find({
      project: project.title,
      owner: req.user._id,
    });

    res.send(allTasks);
  } catch {
    res.status(500).send();
  }
});
module.exports = router;
