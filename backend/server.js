const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("To Krepaki backend is running 🍽️");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
   const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, {
  cors: {
    origin: "*", // Αν θέλεις, βάλε μόνο το frontend σου εδώ
  },
});

// Socket.IO έτοιμο!
io.on("connection", (socket) => {
  console.log("📡 Νέος client συνδέθηκε!");

  socket.on("disconnect", () => {
    console.log("❌ Client αποσυνδέθηκε");
  });
});

// 🔥 Αποθηκεύουμε το io για να το χρησιμοποιούμε αλλού
app.set("io", io);

// Ξεκινάμε τον server
http.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});

  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

  //εγγραφη χρηστη...
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const addressRoutes = require("./routes/addressRoutes");
app.use("/api/addresses", addressRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

