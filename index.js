require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");

const Product = require("./Product"); // Product model

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// MongoDB URI
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    importData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Read JSON file
const products = JSON.parse(fs.readFileSync("products.json", "utf-8"));

// Insert data into MongoDB
const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Data successfully imported!");
  } catch (err) {
    console.error("Error importing data:", err);
  }
};

// Home route
app.get("/", (req, res) => {
  res.send("Fake Store API");
});

// GET API for all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
