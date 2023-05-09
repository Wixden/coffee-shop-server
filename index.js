const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER, process.env.DB_PASS);

const dbUserName = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// MongoDb
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${dbUserName}:${dbPassword}@cluster0.a0pfpbg.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    // Database Collection:
    // First Way
    // const coffeeDB = client.db("coffeeDB");
    // const coffeeCollection = coffeeDB.collection("coffee");

    // 2nd Way:
    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    // All HTTP REQUEST Handlers Start
    // POST METHOD
    app.post("/add-coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);

      //inserting from server to database
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // GET METHOD
    app.get("/coffee", async (req, res) => {
      const coffee = coffeeCollection.find();
      const result = await coffee.toArray();
      res.send(result);
    });
    // All HTTP REQUEST HandlersEnd

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Root:
app.get("/", (req, res) => {
  res.send("Our Coffee Server is running");
});

app.listen(port, () => {
  console.log(`Coffee Server is running in port: ${port}`);
});
