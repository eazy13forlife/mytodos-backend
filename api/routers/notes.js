const express = require("express");
const router = new express.Router();

const authenticateMiddleware = require("../middleware/authenticate.js");
const Note = require("../models/note.js");

//takes in a title and description. We provide user's id ourselves
router.post("/notes", authenticateMiddleware, async (req, res) => {
  try {
    const noteData = req.body;

    const note = new Note({ ...noteData, owner: req.user._id });

    const savedNote = await note.save();

    res.status(201).send(savedNote);
  } catch (e) {
    res.status(400).send({ e: e.message });
  }
});

router.get("/notes", authenticateMiddleware, async (req, res) => {
  try {
    await req.user.populate("notes");

    res.send(req.user.notes);
  } catch {
    res.status(500).send();
  }
});

router.patch("/notes/:id", authenticateMiddleware, async (req, res) => {
  try {
    const noteId = req.params.id;

    const certifiedFields = ["title", "description"];

    const updateData = req.body;

    const updateFields = Object.keys(updateData);

    for (let i = 0; i < updateFields.length; i++) {
      const field = updateFields[i];
      if (!certifiedFields.includes(field)) {
        return res
          .status(400)
          .send({ error: `${field} is not a field you can update` });
      }
    }

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).send();
    }

    updateFields.forEach((field) => {
      note[field] = updateData[field];
    });

    const updatedNote = await note.save();

    res.status(200).send(updatedNote);
  } catch (e) {
    res.status(400).send({ e: e.message });
  }
});

//when i delete a note, i have to find the project we said it has, and remove this note from that project
router.delete("/notes/:id", authenticateMiddleware, async (req, res) => {
  try {
    const noteId = req.params.id;

    await Note.findByIdAndDelete(noteId);

    res.send();
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
