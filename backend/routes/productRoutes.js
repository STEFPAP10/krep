const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Toggle option enabled/disabled


// POST για toggle υλικού
router.post("/toggle-option", async (req, res) => {
  const { productId, sectionTitle, optionName } = req.body;

  if (!productId || !sectionTitle || !optionName) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const section = product.customization.find((s) => s.title === sectionTitle);
    if (!section) return res.status(404).json({ error: "Section not found" });

    const option = section.options.find((o) => o.name === optionName);
    if (!option) return res.status(404).json({ error: "Option not found" });

    // Εναλλαγή της κατάστασης
    option.disabled = !option.disabled;

    // Πες στην Mongoose ότι έγινε αλλαγή σε nested object
    product.markModified("customization");

    await product.save();
    const io = req.app.get("io");
io.emit("productUpdated"); // Μπορείς να στείλεις και id αν θες


    res.json({ success: true, product });
  } catch (err) {
    console.error("❌ Toggle error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
