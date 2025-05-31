const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        number: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String },
        notes: { type: String },

      }
    },
  items: [
    {
      title: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      options: Object // μπορεί να βάλεις κι array αν προτιμάς
    }
  ],
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
