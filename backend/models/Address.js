const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    road: String,
    house_number: String,
    city: String,
    lat: String,
    lon: String,
    display_name: String,
    phone: String,
    floor: String,       // ✅ ΝΕΟ
    buzzer: String,      // ✅ ΝΕΟ
    notes: String        // ✅ ΝΕΟ
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
