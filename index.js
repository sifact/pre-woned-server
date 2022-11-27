const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const cors = require("cors");
const { query } = require("express");
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
        const buyersCollection = client.db("reseller").collection("buyers");
        const addedProductsCollection = client
            .db("reseller")
            .collection("products");
        const advertiseCollection = client
            .db("reseller")
            .collection("advertise");

        app.get("/categories", async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        });

        // get specific user products
        app.get("/products/:email", async (req, res) => {
            const email = req.params.email;

            // const query = { email: email };
            console.log(email);
            const category = await categoriesCollection
                .aggregate([{ $match: { email: { $all: email } } }])
                .toArray();
            res.send(category);
        });

        // get specific category products

        app.get("/category/:id", async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };

            const category = await categoriesCollection.findOne(query);
            res.send(category);
        });

        // get bookings or orders
        app.get("/bookings", async (req, res) => {
            const query = {};
            const orders = await bookingsCollection.find(query).toArray();
            res.send(orders);
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

        // get seller
        app.get("/sellers", async (req, res) => {
            const query = {};
            const seller = await sellersCollection.find(query).toArray();
            res.send(seller);
        });

        // create seller
        app.post("/sellers", async (req, res) => {
            const seller = req.body;
            const result = await sellersCollection.insertOne(seller);
            res.send(result);
        });
        // get buyers db
        app.get("/buyers", async (req, res) => {
            const query = {};
            const buyer = await buyersCollection.find(query).toArray();
            res.send(buyer);
        });
        // create buyer db
        app.post("/buyers", async (req, res) => {
            const buyer = req.body;
            console.log(buyer.email);

            const result = await buyersCollection.insertOne(buyer);
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

        // store product in db
        app.post("/addedProducts", async (req, res) => {
            const product = req.body;

            const result = await addedProductsCollection.insertOne(product);
            res.send(result);
        });

        // get stored added products
        app.get("/addedProducts/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };

            const result = await addedProductsCollection.find(query).toArray();
            res.send(result);
        });

        // advertise data
        app.post("/advertise", async (req, res) => {
            // receive from client
            const product = req.body;

            // const query = {};

            // store in db
            const result = await advertiseCollection.insertOne(product);
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
