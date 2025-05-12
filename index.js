const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster4.7llpb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster4`;

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
    const coffeeCollection = client.db("coffeeCafeDB").collection("coffeeCafe");

    app.get("/coffee-cafe", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray(cursor);
      res.send(result);
    });

    app.get("/coffee-cafe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.post("/coffee-cafe", async (req, res) => {
      const coffee = req.body;
      const result = await coffeeCollection.insertOne(coffee);
      res.send(result);
    });

    app.delete("/coffee-cafe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/coffee-cafe/:id", async (req, res) => {
      const coffee = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateCoffee = {
        $set: {
          productName: coffee.productName,
          brandName: coffee.brandName,
          productImage: coffee.productImage,
          title: coffee.title,
          reason: coffee.reason,
          recommendationCount: coffee.recommendationCount,
        },
      };
      const options = { upsert: true };
      const result = await coffeeCollection.updateOne(
        query,
        updateCoffee,
        options
      );
      res.send(result);
    });

    // reecommendation count

    app.patch("/recommend/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const coffee = await coffeeCollection.findOne(query);

      if (!coffee) {
        return res.status(404).send({ message: "Coffee not found" });
      }

      const updatedDoc = {
        $set: {
          recommendationCount: (coffee.recommendationCount || 0) + 1,
        },
      };

      const result = await coffeeCollection.updateOne(query, updatedDoc);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee cafe on the way to make");
});

app.listen(port, () => {
  console.log(`coffee cafe server running  on port ${port}`);
});
