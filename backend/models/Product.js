const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  disabled:{type:Boolean, required:false}
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true }, // π.χ. "Προσθέστε τυριά"
  required: { type: Boolean, default: false },
  multiple: { type: Boolean, default: true },
  options: [optionSchema],
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    image: String,
    price: { type: Number, required: true }, // αρχική τιμή (π.χ. 1.80)
    category: String, // π.χ. "My crepa"
    customization: [sectionSchema], // ✅ Οι επιλογές
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
