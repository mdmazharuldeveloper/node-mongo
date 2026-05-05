const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB URI
const uri = "mongodb+srv://shovon:shovon22@project1.ae1jeqa.mongodb.net/organicdb";

const client = new MongoClient(uri);

let productsCollection;

// connect DB
async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db("organicdb");
        productsCollection = db.collection("products");

    } catch (error) {
        console.error("❌ DB connection error:", error);
    }
}
connectDB();

// serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// add product
app.post('/add-product', async (req, res) => {
    try {
        const product = {
            name: req.body.name,
            price: parseFloat(req.body.price),
            category: req.body.category
        };

        await productsCollection.insertOne(product);

        res.send(`<h2>✅ Product Added</h2><a href="/">Go Back</a>`);
    } catch (err) {
        res.status(500).send("❌ Insert failed");
    }
});

// get all products
app.get('/products', async (req, res) => {
    try {
        const data = await productsCollection.find().toArray();
        res.json(data);
    } catch {
        res.status(500).send("❌ Fetch failed");
    }
});

// delete product
app.delete('/delete-product/:id', async (req, res) => {
    try {
        const result = await productsCollection.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.send({ success: result.deletedCount === 1 });
    } catch {
        res.status(500).send("❌ Delete failed");
    }
});

// update product
app.put('/update-product/:id', async (req, res) => {
    try {
        const result = await productsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    name: req.body.name,
                    price: parseFloat(req.body.price),
                    category: req.body.category
                }
            }
        );

        res.send({ success: result.modifiedCount === 1 });
    } catch {
        res.status(500).send("❌ Update failed");
    }
});

// start server
app.listen(port, () => {
    console.log(`🚀 http://localhost:${port}`);
});