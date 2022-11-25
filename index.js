const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const cors = require("cors");
// const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xloj4nu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const categoriesCollection = client
            .db("reseller")
            .collection("categories");

        app.get("/categories", async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        });

        // get specific category products

        app.get("/category/:id", async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            console.log(query);
            const category = await categoriesCollection.findOne(query);
            res.send(category);
        });
    } finally {
    }
}

run().catch((e) => console.log(e));
app.get("/", async (req, res) => {
    res.send("reseller server is running");
});

app.listen(port, () => {
    console.log(`reseller running on ${port}`);
});
