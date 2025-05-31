const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, lastname,email, password } = req.body;

    // Έλεγχος αν υπάρχει ήδη χρήστης
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Ο χρήστης υπάρχει ήδη." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === "admin@krepaki.gr" ? "admin" : "user";

    // Δημιουργία νέου χρήστη
    const newUser = new User({
      username,
      lastname,
      email,
      password: hashedPassword,
      role: role, // πάντα 'user'
    });

    await newUser.save();

    res.status(201).json({ message: "✅ Εγγραφή επιτυχής!" });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Κάτι πήγε στραβά στον server." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Έλεγχος αν υπάρχει χρήστης με αυτό το email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Μη έγκυρο email." });
    }

    console.log("Submitted:", `"${password}"`);
console.log("Stored:", `"${user.password}"`);


    // Έλεγχος αν ο κωδικός είναι σωστός
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Λάθος κωδικός." });
    }

    // Δημιουργία JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Επιστροφή στοιχείων
    res.status(200).json({
      message: "✅ Σύνδεση επιτυχής!",
      token,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Κάτι πήγε στραβά." });
  }
});


module.exports = router;
