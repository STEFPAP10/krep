const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/tokrepaki", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seed = async () => {
  await Product.deleteMany(); // 🚨 Αν θέλεις καθαρή αρχή

  const products = [
    {
      title: "Φτιάξτε τη δική σας αλμυρή κρέπα",
      description: "Δημιουργηστε την δικα σας αλμυρη κρεπα με τα αγαπημενας υλικα",
      category: "My crepa",
      price: 1.8,
      image: "/images/krepa.jpeg",
      customization: [
        {
          title: "Τυριά",
          multiple: true,
          options: [
            { name: "Gouda", price: 1 },
            { name: "Cheddar", price: 1 },
            { name: "Φέτα", price: 1 },
          ],
        },
        {
          title: "Λαχανικά",
          multiple: true,
          options: [
            { name: "Ντομάτα", price: 0.5 },
            { name: "Μαρούλι", price: 0.4 },
          ],
        },
      ],
    },
    {
      title: "Φτιάξτε το δικό σας σάντουιτς",
      description: "Επέλεξε ψωμί, τυριά, αλλαντικά και συνοδευτικά",
      category: "My sandwich",
      price: 1.5,
      image: "/images/san.jpeg",
      customization: [
        {
          title: "Ψωμί",
          multiple: false,
          options: [
            { name: "Λευκό", price: 0.8 },
            { name: "Ολικής", price: 1.2 },
          ],
        },
        {
          title: "Αλλαντικά",
          multiple: true,
          options: [
            { name: "Μπέικον", price: 0.6 },
            { name: "Ζαμπόν", price: 0.5 },
          ],
        },
      ],
    },
    {
      title: "Φτιάξτε τη δική σας γλθκιά κρέπα",
      description: "Δημιουργηστε την δικα σας γλυκια κρεπα με τα αγαπημενας υλικα",
      category: "My crepa",
      price: 1.8,
      image: "/images/krepaS.jpeg",
      customization: [
        {
          title: "πραλινες",
          multiple: true,
          options: [
            { name: "Σοκολατα", price: 1},
            { name: "buenno", price: 1 },
            { name: "Φραουλα", price: 1 },
          ],
        },
        {
          title: "φρουτα",
          multiple: true,
          options: [
            { name: "μπανανα", price: 0.5 },
            { name: "φραουλα", price: 0.4 },
          ],
        },
      ],
    },
  ];

  products.forEach(product => {
    product.customization.forEach(section => {
      section.options = section.options.map(option => ({
        ...option,
        disabled: false
      }));
    });
  });

  // ✅ Τώρα τα options είναι έτοιμα με το disabled πεδίο


  await Product.insertMany(products);
  console.log("✔️ Προϊόντα προστέθηκαν με επιτυχία");
  mongoose.disconnect();
};

seed();
