const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("username lastname");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Σφάλμα κατά την ανάκτηση χρήστη." });
  }
});

module.exports = router;
