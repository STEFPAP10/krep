const express = require("express");
const router = express.Router();
const Address = require("../models/Address");
const jwt = require("jsonwebtoken");

// Middleware για προστασία routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Δεν υπάρχει token." });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Μη έγκυρο token." });
    req.userId = decoded.userId;
    next();
  });
};

// POST /api/addresses
// POST /api/addresses
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      road,
      house_number,
      city,
      lat,
      lon,
      display_name,
      phone,
      floor,
      buzzer,
      notes
    } = req.body;

    const address = new Address({
      userId: req.userId,
      road,
      house_number,
      city,
      lat,
      lon,
      display_name,
      phone,
      floor,
      buzzer,
      notes
    });

    await address.save();
    res.status(201).json({ message: "📍 Διεύθυνση αποθηκεύτηκε!", address });
  } catch (err) {
    console.error("❌ Address save error:", err.message);
    res.status(500).json({ message: "Σφάλμα κατά την αποθήκευση." });
  }
});



// GET /api/addresses
router.get("/", verifyToken, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ addresses });
  } catch (err) {
    console.error("❌ Failed to fetch addresses:", err.message);
    res.status(500).json({ message: "Σφάλμα κατά την ανάκτηση διευθύνσεων." });
  }
});

// UPDATE διεύθυνσης
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ address: updatedAddress });
  } catch (err) {
    console.error("❌ Address update error:", err.message);
    res.status(500).json({ message: "Σφάλμα κατά την ενημέρωση" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Διεύθυνση διαγράφηκε" });
  } catch (err) {
    res.status(500).json({ message: "Σφάλμα διαγραφής" });
  }
});



module.exports = router;
