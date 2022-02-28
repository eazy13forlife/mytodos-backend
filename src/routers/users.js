const express = require("express");
const router = new express.Router();

const User = require("../models/user.js");
const authenticateMiddleware = require("../middleware/authenticate.js");

//login user
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body; //email and password
  try {
    const user = await User.validateCredentials(email, password);

    const token = await user.generateAuthToken();

    await user.save();

    res.send({ user, token });
  } catch (e) {
    res.status(401).send({ error: e.message });
  }
});

//create user account. Need to provide name,email and password
router.post("/users/create", async (req, res) => {
  const userData = req.body;

  try {
    const user = new User(userData);

    const token = await user.generateAuthToken();

    const savedUser = await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e); //i am going with validation error
  }
});

//gets user info
router.get("/users/me", authenticateMiddleware, (req, res) => {
  const user = req.user;
  res.send(user);
});

router.patch("/users/me", authenticateMiddleware, async (req, res) => {
  try {
    //make sure user is trying to update a valid field
    const confirmedFields = ["name", "email", "password"];

    const updateData = req.body;

    const updateFields = Object.keys(req.body);

    const matches = updateFields.every((field) => {
      if (confirmedFields.includes(field)) {
        return true;
      }
    });

    if (!matches) {
      throw new Error("hello");
    }

    //update each field
    const user = req.user;

    updateFields.forEach((field) => {
      user[field] = updateData[field];
    });

    //save the user
    const savedUser = await user.save();

    res.send(savedUser);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//update password. Need to provide currentPassword and new password. if current password matches, password is updated
router.patch("/users/me/password", authenticateMiddleware, async (req, res) => {
  try {
    const passwordData = req.body;

    //check if user's current password exists. If not, error will be thrown
    await req.user.verifyPassword(passwordData.current);

    //update user's password
    req.user.password = passwordData.new;

    await req.user.save();
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//log off a single device
router.post("/users/logout", authenticateMiddleware, async (req, res) => {
  try {
    //remove current token from user's tokens list
    req.user.tokens = req.user.tokens.filter(
      (tokenObject) => tokenObject.token !== req.token
    );

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

//log off all devices
router.post("/users/logout/all", authenticateMiddleware, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

//delete profile
router.delete("/users/me/delete", authenticateMiddleware, async (req, res) => {
  try {
    await req.user.deleteOne();

    res.send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;
