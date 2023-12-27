const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

// connection url
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
  }
}

const dbName = "pg";
const collectionName = "leaderboard";
const leaderboardCollection = client.db(dbName).collection(collectionName);
client.db(dbName).collection(collectionName);
// Lambda handler
exports.handler = async (event, context) => {
  connectToMongoDB();
  try {
    if (event.httpMethod === "GET") {
      const leaderboardData = await leaderboardCollection.find({}).toArray();

      return {
        statusCode: 200,
        body: JSON.stringify(leaderboardData),
      };
    } else if (event.httpMethod === "POST") {
      const leaderboardData = JSON.parse(event.body);
      const result = await leaderboardCollection.insertOne(leaderboardData);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Leaderboard data stored successfully",
          insertedId: result.insertedId,
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Unsupported HTTP method" }),
      };
    }
  } catch (err) {
    console.error("Error processing request:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
