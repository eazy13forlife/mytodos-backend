const express = require("express");
const router = new express.Router();

const Task = require("../models/task.js");
const authenticateMiddleware = require("../middleware/authenticate.js");
module.exports = router;

// Create a project. Needs title and ownerId for sure, description,dueDate,priority,project ae all optional.
router.post("/tasks", authenticateMiddleware, async (req, res) => {
  try {
    const taskData = req.body;

    const task = new Task(taskData);

    //we need to provide the id of owner ourself, since the user won't
    task.owner = req.user._id;

    const savedTask = await task.save();

    res.status(201).send(savedTask);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.patch("/tasks/:id", authenticateMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = req.body;

    const updateFields = Object.keys(updateData);

    const certifiedFields = [
      "title",
      "description",
      "dueDate",
      "priority",
      "project",
    ];

    //make sure user is only changing valid fields
    for (let i = 0; i < updateFields; i++) {
      const field = updateFields[i];
      if (!certifiedFields.includes(field)) {
        return res
          .status(400)
          .send({ error: `${field} isn't valid to change` });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).send();
    }

    res.send(updatedTask);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/tasks/:id", authenticateMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    //find task that has owner of user's id and has correct id of task
    const task = await Task.findOne({ _id: id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send({ task });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/tasks", authenticateMiddleware, async (req, res) => {
  try {
    await req.user.populate("tasks");

    res.send(req.user.tasks);
  } catch {
    res.status(500).send();
  }
});

router.delete("/tasks/:id", authenticateMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).send();
    }

    res.send();
  } catch {
    res.status(500).send();
  }
});
