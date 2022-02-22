const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const mongoClient = new MongoClient(url);

const dbName = "todo-list-api";

const run = async () => {
  try {
    //connects to MongoDB database server
    await mongoClient.connect();
    console.log("connected sucessfully to mongodb database server");
  } catch (e) {
    console.log(e);
  }
};

/*
const run = async () => {
  try {
    //connects to MongoDB database server
    await mongoClient.connect();

    console.log("connected sucessfully to mongodb database server");

    //creates a new db instance "todo-list-api" sharing the current socket connections
    db = mongoClient.db(dbName);

    //fetch the users collection or create it if not already there
    //const usersCollection = db.collection("users");
  } catch (e) {
    console.log(e);
  }
};
*/
run();

module.exports = { mongoClient, ObjectId };
