const mongoose = require("mongoose");

const noteScheme = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
