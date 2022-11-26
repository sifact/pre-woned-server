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
        const bookingsCollection = client.db("reseller").collection("bookings");
        const sellersCollection = client.db("reseller").collection("sellers");

        app.get("/categories", async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        });

        // get specific category products

        app.get("/category/:id", async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };

            const category = await categoriesCollection.findOne(query);
            res.send(category);
        });

        // bookings
        app.post("/bookings", async (req, res) => {
            // receive from client
            const booking = req.body;
            console.log(booking);

            const query = {};

            // store in db
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        });

        // create seller
        app.post("/sellers", async (req, res) => {
            const seller = req.body;
            const result = await sellersCollection.insertOne(seller);
            res.send(result);
        });

        app.post("/addedProducts/:brand", async (req, res) => {
            const product = req.body;
            const category = req.params.brand;

            const result = await categoriesCollection.findOneAndUpdate(
                { title: category },
                {
                    $addToSet: {
                        products: product,
                    },
                }
            );
            res.send(result);
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
