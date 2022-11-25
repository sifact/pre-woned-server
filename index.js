const express = require("express");

const cors = require("cors");
// const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// async function run() {
//     try {
//     } finally {
//     }
// }

// run().catch((e) => console.log(e));
app.get("/", async (req, res) => {
    res.send("reseller server is running");
});

app.listen(port, () => {
    console.log(`reseller running on ${port}`);
});
