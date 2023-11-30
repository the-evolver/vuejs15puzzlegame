// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

// connection -> ..connection url
const uri =
  "mongodb+srv://atul:1234@cluster0.u6ugwdl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
  }
}

connectToMongoDB();

const dbName = "pg";
const collectionName = "leaderboard";
const leaderboardCollection = client.db(dbName).collection(collectionName);
client.db(dbName).collection(collectionName);
app.post("/leaderboard", async (req, res) => {
  try {
    const leaderboardData = req.body;
    const result = await leaderboardCollection.insertOne(leaderboardData);
    res.json({
      message: "Leaderboard data stored successfully",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("Error storing leaderboard data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const leaderboardData = await leaderboardCollection.find({}).toArray();
    res.json(leaderboardData);
  } catch (err) {
    console.error("Error retrieving leaderboard data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
