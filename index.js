const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ FIX for form data

// MongoDB URI
const uri = "mongodb+srv://shovon:shovon22@project1.ae1jeqa.mongodb.net/organicdb";

const client = new MongoClient(uri);

let productsCollection;

// connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db("organicdb");
        productsCollection = db.collection("products");

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
    }
}

connectDB();


// serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// ✅ INSERT PRODUCT
app.post('/add-product', async (req, res) => {
    try {
        console.log("Form Data:", req.body); // debug

        const product = {
            name: req.body.name,
            price: parseFloat(req.body.price),
            category: req.body.category
        };

        const result = await productsCollection.insertOne(product);

        res.send(`
            <h2>✅ Product Added Successfully</h2>
            <a href="/">Go Back</a>
        `);

    } catch (error) {
        console.error(error);
        res.status(500).send("❌ Failed to insert product");
    }
});


// ✅ GET ALL PRODUCTS
app.get('/products', async (req, res) => {
    try {
        const products = await productsCollection.find().toArray();
        res.json(products);
    } catch (error) {
        res.status(500).send("❌ Failed to fetch products");
    }
});


// start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});