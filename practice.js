const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hashPass = async (password) => {
  //to hash a password
  const hashedPass = await bcrypt.hash(password, 10);
  console.log(hashedPass);
  //to check if a password equals the hash
  const isTrue = await bcrypt.compare(
    "jonathons",
    "$2b$10$zQmPCLEsnrLq/Js.sGtEn.znxUGHlXhGQ85yM9smkLbI/EpA2y67S"
  );
  console.log(isTrue);
};

const jwtPractice = async () => {
  const token = await jwt.sign({ _id: "342342342" }, "secretKey");
  const isValid = await jwt.verify(token, "secretKey");
  console.log(isValid);
};

console.log(jwtPractice());
