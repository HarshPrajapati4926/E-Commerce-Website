const Product = require("../models/Products");

// get all product persent in product folder
const getProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    console.log("Products fetched successfully");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id + 1;
    } else {
      id = 1;
    }
    const newProduct = new Product({
      id: id,
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      subcategory: req.body.subcategory,
      price: req.body.price,
      image1: req.body.image1,
      image2: req.body.image2,
      image3: req.body.image3,
      image4: req.body.image4,
      introduction: req.body.introduction,
      color: req.body.color,
      about: req.body.about,
      tags: req.body.tags,
      material: req.body.material,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove a product by ID
const removeProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addProduct,
  removeProduct,
  getProduct,
};
