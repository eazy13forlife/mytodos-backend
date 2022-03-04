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

console.log(
  validator.isDate("08/09/2098", {
    format: "MM-DD-YYYY",
    delimiters: ["/", "-"],
  })
);

const currentDate = moment().format("YYYY-MM-DD");
console.log(moment(currentDate).valueOf());
validator.isBefore("03/23/2024", "02/22/2023");

const mike = "hello";
const dog = mike.split("");
console.log(mike);
console.log(dog);
