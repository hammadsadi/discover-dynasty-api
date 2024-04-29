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
    origin: ["http://localhost:5173", "https://tourism-2d1ca.web.app"],
  })
);

/**
 * MongoDB
 */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apymwsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // DB and Collection
    const touristsCollection = client.db("touristsSpotDB").collection("spots");
    const touristsCountryCollection = client
      .db("touristsSpotDB")
      .collection("country");

    // Create Spot
    app.post("/spot", async (req, res) => {
      const spotInfo = req.body;
      const existCountry = { countryName: spotInfo.countryName };

      const checkCountry = await touristsCountryCollection.findOne(
        existCountry
      );
      // Validate
      if (!checkCountry) {
        const countryresult = await touristsCountryCollection.insertOne(
          spotInfo
        );
      }
      const result = await touristsCollection.insertOne(spotInfo);
      res.send(result);
    });

    // Get All Spot
    app.get("/spot", async (req, res) => {
      const cursor = touristsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get Countries
    app.get("/counties", async (req, res) => {
      const cursor = touristsCountryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // Get Related Countries
    app.get("/counties/:country", async (req, res) => {
      const { country } = req.params;
      const filter = { countryName: country };
      const cursor = touristsCollection.find(filter);
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
    app.get("/user-added-spot-list/:username", async (req, res) => {
      const { username } = req.params;
      const query = { userName: username };
      const cursor = touristsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get Single User
    app.get("/update-my-spot-list/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await touristsCollection.findOne(query);
      res.send(result);
    });

    // Update my Spot List
    app.patch("/update-my-spot-list/:id", async (req, res) => {
      const { id } = req.params;
      const spotInfo = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateSpot = {
        $set: {
          touristsSpotName: spotInfo.touristsSpotName,
          photoURL: spotInfo.photoURL,
          countryName: spotInfo.countryName,
          location: spotInfo.location,
          averageCost: spotInfo.averageCost,
          seasonality: spotInfo.seasonality,
          travelTime: spotInfo.travelTime,
          totalVisitorsPerYear: spotInfo.totalVisitorsPerYear,
          shortDescription: spotInfo.shortDescription,
        },
      };

      // Update Now
      const result = await touristsCollection.updateOne(filter, updateSpot);
      res.send(result);
    });

    // Delete Spot
    app.delete("/spot-delete/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await touristsCollection.deleteOne(query);
      res.send(result);
    });

    // Sorting Average Cost
    app.get("/sorting/:cost", async (req, res) => {
      const { cost } = req.params;
      let convertCost = parseInt(cost);
      // Get Db
      const query = { averageCost: { $lt: convertCost } };

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
