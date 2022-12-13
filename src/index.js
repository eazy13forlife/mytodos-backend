const express = require("express");
require("./db/mongoose.js");
const path = require("path");
const cors = require("cors");

const usersRouter = require("./routers/users.js");
const tasksRouter = require("./routers/tasks.js");
const notesRouter = require("./routers/notes.js");
const projectsRouter = require("./routers/projects.js");

//creates our express application
const app = express();

//set up our port
const port = process.env.PORT || 3000;

//set up public path
const publicPath = path.join(__dirname, "../public/");

//set up express to use public directory
//app.use(express.static(publicPath));

app.use(
  cors({
    allowedHeaders: ["Content-Type", "authorization", "Accept"],
    origin: "*",
    preflightContinue: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);
//server parses incoming json received
app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);
app.use(notesRouter);
app.use(projectsRouter);

app.listen(port, () => {
  console.log(`Your express server is running on port ${port}.`);
});
