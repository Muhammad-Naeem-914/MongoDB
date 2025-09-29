import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();

//To connect node-js with mongodb
const dbName = "college";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
let db;
app.set("view engine", "ejs"); //this is template engine
app.use(express.urlencoded({ extended: true })); //this middleware is used to get data from form submitted
app.use(express.json());
client.connect().then((connection) => {
  db = connection.db(dbName);
});

app.get("/ui", async (req, resp) => {
  const collection = db.collection("students");
  const result = await collection.find().toArray();
  console.log(result);
  resp.render("students", { students: result });
});

app.get("/add", async (req, resp) => {
  `<form action="/add-students" method="post">
  <input type="text" placeholder="Enter your name" name="name" />
  <br />
  <br />
  <input type="email" placeholder="Enter your email" name="email" />
  <br />
  <br />
  <input type="text" placeholder="Enter your age" name="age" />
  <br />
  <br />
  <button>add student</button>
</form>`;
});

app.post("/add-students", async (req, resp) => {
  // console.log(req.body);
  const collection = db.collection("students");
  const result = await collection.insertOne(req.body);
  console.log(result);
  resp.send("Data saved");
});

//post api for save data in mongodb
app.post("/add-student-api", async (req, resp) => {
  console.log(req.body);

  const { name, age, email } = req.body;
  if (!name || !age || !email) {
    resp.send({ message: "operation failed", success: false });
    return false;
  }
  const collection = db.collection("students");
  const result = await collection.insertOne(req.body);

  resp.send({ message: result });
});

//delete api for delete data in mongodb
app.delete("/delete/:id", async (req, resp) => {
  console.log(req.params.id);
  const collection = db.collection("students");
  const result = await collection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  if (result) {
    resp.send({
      message: "student data deleted",
      success: true,
    });
  } else {
    resp.send({
      message: "student data not deleted,try after sometimr",
      success: false,
    });
  }
});

app.get("/ui/student/:id", async (req, resp) => {
  const id = req.params.id;
  console.log(id);

  const collection = db.collection("students");
  const result = await collection.findOne({
    _id: new ObjectId(req.params.id),
  });
  resp.render("test", { result });
});

app.get("/student/:id", async (req, resp) => {
  const id = req.params.id;
  console.log(id);

  const collection = db.collection("students");
  const result = await collection.findOne({
    _id: new ObjectId(req.params.id),
  });
  resp.send({
    message: "data fetched",
    success: true,
    result: result,
  });
});
app.listen(3200, () => {
  console.log("Server running at http://localhost:3200");
});
