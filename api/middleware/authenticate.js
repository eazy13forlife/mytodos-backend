const jwt = require("jsonwebtoken");

const User = require("../models/user.js");

const authenticate = async (req, res, next) => {
  try {
    //get authToken by splitting at space that separates bearer from our authToken
    const authToken = req.headers.authorization.split(" ")[1];
    console.log(authToken);
    //if jwt can't verify this auth token, an error will be thrown, otherwise we will get back the decoded data
    const decoded = await jwt.verify(authToken, process.env.JWT_SECRET);

    const userId = decoded._id;

    //find user with that id and that token in their tokens array
    const user = await User.findOne({ id: userId, "tokens.token": authToken });

    if (!user) {
      throw new Error();
    }
    req.token = authToken;
    req.user = user;

    next();
  } catch {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = authenticate;
