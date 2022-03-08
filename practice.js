const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const validator = require("validator");
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

const checkDateInFuture = (todaysDate, newDate) => {
  let date1 = moment(todaysDate).toObject();
  let date2 = moment(newDate).toObject();

  if (date2.years < date1.years) {
    return false;
  }

  if (date2.years === date1.years) {
    if (date2.months < date1.months) {
      return false;
    }
  }

  if (date2.years === date1.years && date2.months === date1.months) {
    if (date2.date < date1.date) {
      return false;
    }
  }

  return true;
};

const specifiedDateParsed = moment("03-08-2022", "MM-DD-YYYY").valueOf();
console.log(moment("03-08-2022", "MM-DD-YYYY").toISOString());
