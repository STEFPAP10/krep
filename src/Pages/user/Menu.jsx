import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";
import ProductModal from "../../components/ProductModal";
import { Button } from "react-bootstrap";
import { io } from "socket.io-client";
import Cart from "../../components/cart";
import { useCart } from "../../context/CartContext";


const Menu = () => {
  // const [cart, setCart] = useState([]);
  const { cart, addToCart, updateQuantityById } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const { updateItemInCart } = useCart();

const handleUpdateCart = (updatedItem) => {
  updateItemInCart(updatedItem);
  setSelectedProduct(null);
  setEditingItemId(null);
};



  // 🔁 Fetch προϊόντα από backend
  useEffect(() => {
  const socket = io("http://localhost:5000");

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const grouped = data.reduce((acc, product) => {
          const cat = product.category || "Χωρίς κατηγορία";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(product);
          return acc;
        }, {});
        const formatted = Object.entries(grouped).map(([title, products]) => ({
          title,
          products,
        }));
        setCategories(formatted);
      });
  };

  // 🔁 Κάνε fetch αρχικά
  fetchProducts();

  // 👂 Άκου το event από backend
  socket.on("productUpdated", () => {
    console.log("📥 Πήραμε ενημέρωση από admin");
    fetchProducts();
  });

  // 🔴 Καθαρισμός όταν κλείσει η σελίδα
  return () => {
    socket.disconnect();
  };
}, []);

  const handleAddToCart = (productWithOptions) => {
      addToCart(productWithOptions);

  };

  const [editingItemId, setEditingItemId] = useState(null);

const handleEditItem = (item) => {
  setEditingItemId(item.id); // ή _id, ανάλογα
  setSelectedProduct(item);
};


  

  const handleQuantityChange = (productId, delta) => {
  updateQuantityById(productId, delta);
};


  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity +
      Object.values(item.options || {})
        .flat()
        .length * 0,
    0
  );

  return (
    <>
      <Header />
      <div className="container mt-4 mb-5">
        <div className="row">
  {/* 🎯 Προϊόντα δεξιά */}
  <div className="col-md-8">
    {categories.map((cat, index) => (
      <div key={index} className="mb-5">
        <h5 className="fw-bold border-bottom pb-2">{cat.title}</h5>
        {Array.isArray(cat.products) &&
          cat.products.map((product) => (
            <div
              key={product._id}
              onClick={() => setSelectedProduct(product)}
            >
              <ProductCard product={product} />
            </div>
          ))}
      </div>
    ))}
  </div>
  <div className="col-md-4">
    <Cart
      cart={cart}
      onQuantityChange={handleQuantityChange}
      total={total}
      onItemClick={handleEditItem}
    />
  </div>
</div>

      </div>

      {/* 🧾 Modal επιλογών */}
      <ProductModal
  show={!!selectedProduct}
  onHide={() => {
    setSelectedProduct(null);
    setEditingItemId(null);
  }}
  product={selectedProduct}
  onAddToCart={handleAddToCart}
  onUpdateCart={handleUpdateCart}
  editingId={editingItemId}
/>

    </>
  );
};

export default Menu;
