const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Init Express
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

/**
 * MongoDB
 */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apymwsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri =
//   "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // DB and Collection
    const touristsCollection = client.db("touristsSpotDB").collection("spots");

    // Create Spot
    app.post("/spot", async (req, res) => {
      const spotInfo = req.body;

      const result = await touristsCollection.insertOne(spotInfo);
      res.send(result);
    });

    // Get All Spot
    app.get("/spot", async (req, res) => {
      const cursor = touristsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get Single Spot
    app.get("/spot/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await touristsCollection.findOne(query);
      res.send(result);
    });

    // Get User Added Spot List
    app.get("/user-added-spot-list/:email", async (req, res) => {
      const { email } = req.params;
      const query = { userEmail: email };
      const cursor = touristsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/sadi", (req, res) => {
  res.send("Hello Im From Sadi Route");
});

// Listen Server
app.listen(port, () => {
  console.log(`Server is Running On PORT ${port}`);
});
