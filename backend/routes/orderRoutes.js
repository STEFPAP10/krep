const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Δημιουργία νέας παραγγελίας
router.post("/", async (req, res) => {
  try {
    const {
      customer,
      items,
      paymentMethod,
      comment,
      noPlastic,
      tip,
      total
    } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ error: "Incomplete order data" });
    }

    const newOrder = new Order({
      customer,
      items,
      paymentMethod,
      comment,
      noPlastic,
      tip,
      total,
      status: "draft", // ή "pending" αν προτιμάς
    });

    await newOrder.save();

    // Αν έχεις socket.io ενεργό στο app.js, μπορείς να κάνεις:
    req.app.get("io")?.emit("new-order", newOrder);

    res.status(201).json({ order: newOrder });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Αποστολή στον admin (αλλάζει status)
router.post("/:id/send-to-admin", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = "pending"; // ή "sent"
    await order.save();

    res.status(200).json({ message: "Order sent to admin", order });
  } catch (err) {
    console.error("Send-to-admin error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Λήψη της τελευταίας παραγγελίας (απλή υλοποίηση)
router.get("/latest", async (req, res) => {
  try {
    const latest = await Order.findOne().sort({ createdAt: -1 }).limit(1);
    if (!latest) return res.status(404).json({ message: "No orders found" });

    res.json({ order: latest });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Φόρτωση παραγγελιών με φίλτρο status (π.χ. για admin panel)
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
