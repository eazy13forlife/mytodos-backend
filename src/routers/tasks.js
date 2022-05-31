const express = require("express");
const router = new express.Router();
const moment = require("moment");

const Task = require("../models/task.js");
const authenticateMiddleware = require("../middleware/authenticate.js");
module.exports = router;

// Create a project. Needs title and ownerId for sure, description,dueDate,priority,project ae all optional.
router.post("/tasks", authenticateMiddleware, async (req, res) => {
  try {
    const taskData = req.body;

    if (!taskData.project) {
      taskData.project = undefined;
    }
    const task = new Task(taskData);

    //we need to provide the id of owner ourself, since the user won't
    task.owner = req.user._id;

    const savedTask = await task.save();

    res.status(201).send(savedTask);
  } catch (e) {
    res.status(400).send(e);
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
      "completed",
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

    const task = await Task.findById(id);

    const initialTask = { ...task._doc };

    if (!task) {
      return res.status(404).send();
    }

    updateFields.forEach((field) => {
      if (!updateData[field]) {
        task[field] = undefined;
      } else {
        task[field] = updateData[field];
      }
    });

    const updatedTask = await task.save({ validateModifiedOnly: true });

    res.send({ original: initialTask, updated: updatedTask });
  } catch (e) {
    res.status(400).send(e);
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
  const query = req.query;

  //create sort object
  const sort = {};

  if ("sortBy" in query) {
    const sortArray = query.sortBy.split("_");

    sortArray.forEach((sortingPair) => {
      const pairArray = sortingPair.split(":");
      sort[pairArray[0]] = pairArray[1];
    });
  }

  //create filters object;
  const filter = {};

  Object.keys(query).forEach((key) => {
    if (key !== "sortBy") {
      filter[key] = query[key];
    }
  });

  //updating filter for dueDate
  if ("dueDate" in filter) {
    const todaysDate = moment().startOf("day").toISOString();

    if (filter.dueDate === "today") {
      filter.dueDate = { $eq: todaysDate };
    } else if (filter.dueDate === "upcoming") {
      filter.dueDate = { $gt: todaysDate };
    }
  }

  try {
    await req.user.populate({
      path: "tasks",
      match: filter,
      options: { sort: sort },
    });

    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e.stack);
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

    res.send(deletedTask);
  } catch (e) {
    res.status(500).send(e);
  }
});

//practice route////////////////////////////////////
router.patch("/tasks2/:id", authenticateMiddleware, async (req, res) => {
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

    const task = await Task.findOneAndReplace(
      { dueDate: 1646467200000 },
      { dueDate: 1586934000000 },
      { runValidators: true }
    );
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
