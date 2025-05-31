import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import logo from "../../assets/krepaki-logo.png";
import AddressDropdown from "../../components/AddressDropdown";
import Cart from "../../components/cart";
import ProductModal from "../../components/ProductModal";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantityById,
    updateItemInCart,
    clearCart
  } = useCart();

  const [total, setTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  // Πληροφορίες χρήστη & διεύθυνσης
const [selectedAddress, setSelectedAddress] = useState({
  street: "",
  number: "",
  city: ""
});
  const [userName, setUserName] = useState("Χρήστης");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const token = localStorage.getItem("token");

  // Επιλογές παραγγελίας
  const [paymentMethod, setPaymentMethod] = useState("Μετρητά");
  const [comment, setComment] = useState("");
  const [noPlastic, setNoPlastic] = useState(false);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    if (!token) return;

    // Φέρε όνομα χρήστη
    fetch("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          const fullName = `${data.user.username} ${data.user.lastname}`;
          setUserName(fullName);
        }
      });

    // Φέρε διεύθυνση
    fetch("http://localhost:5000/api/addresses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const latest = data.addresses?.[0];
        if (latest) {
setSelectedAddress({
  street: latest.road,
  number: latest.house_number,
  city: latest.city,
  phone: latest.phone
});
        }
      });
  }, [token]);

  useEffect(() => {
    const cartTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(cartTotal + tip);
  }, [cart, tip]);

  const handleQuantityChange = (productId, delta) => {
    updateQuantityById(productId, delta);
  };

  const handleEditItem = (item) => {
    setSelectedProduct(item);
    setEditingItemId(item.id);
  };

  const handleSubmit = () => {
    if (!token) return alert("Δεν είστε συνδεδεμένος.");

    const order = {
  customer: {
    firstName: userName.split(" ")[0] || "Πελάτης",
    lastName: userName.split(" ")[1] || "",
    address: {
      street: selectedAddress.street,
      number: selectedAddress.number,
      city: selectedAddress.city,
      phone: selectedAddress.phone,
      notes: selectedAddress.notes
    }
  },
  items: cart,
  paymentMethod,
  comment,
  noPlastic,
  tip,
  total
};


    fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then(() => {
        clearCart();
        navigate("/thank-you");
      })
      .catch(() => alert("Αποτυχία αποστολής παραγγελίας"));
  };

  return (
    <div className="pb-5">
      {/* Header */}
      <div style={{ background: "#FAFAF3", padding: "1rem" }}>
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
      </div>

      {/* Modal διεύθυνσης */}
      <AddressDropdown
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelect={(address) => {
          setSelectedAddress({
  street: address.road,
  number: address.house_number,
  city: address.city,
  phone: address.phone,
});

          setShowAddressModal(false);
        }}
      />

      {/* Περιεχόμενο */}
      <div className="container py-4 mb-5">
        <Row>
          {/* Καλάθι */}
          <Col md={{ span: 5, order: 2 }}>
            <Cart
              cart={cart}
              total={total}
              onQuantityChange={handleQuantityChange}
              onItemClick={handleEditItem}
              showCheckoutButton={false}
            />
          </Col>

          {/* Πληροφορίες */}
          <Col md={{ span: 7, order: 1 }}>
            {/* Διεύθυνση */}
            <Card
              className="p-3 mb-3 border-0 shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => setShowAddressModal(true)}
            >
              <h6 className="fw-bold mb-1">Παραλαβή από:</h6>
              <p className="mb-1">{userName}</p>
<p className="mb-0 text-muted">
  {selectedAddress.street} {selectedAddress.number}, {selectedAddress.city}
</p>
            </Card>

            {/* Τρόπος Πληρωμής */}
            <Card className="p-3 mb-3 border-0 shadow-sm">
              <h6 className="fw-bold mb-2">Τρόπος Πληρωμής</h6>
              <div className="d-flex gap-2">
                {["Μετρητά", "Κάρτα"].map((method) => (
                  <Button
                    key={method}
                    variant={
                      paymentMethod === method
                        ? "success"
                        : "outline-secondary"
                    }
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Tip */}
            <Card className="p-3 mb-3 border-0 shadow-sm">
              <h6 className="fw-bold mb-2">Tip για διανομέα</h6>
              <small className="text-muted mb-2 d-block">
                Αποδίδεται 100% στον διανομέα-συνεργάτη
              </small>
              <div className="d-flex gap-2 flex-wrap">
  {[0.5, 1, 2, 5].map((value) => (
    <Button
      key={value}
      variant={tip === value ? "success" : "outline-secondary"}
      onClick={() =>
        setTip(tip === value ? 0 : value) // toggle logic!
      }
    >
      €{value.toFixed(2)}
    </Button>
  ))}
</div>

            </Card>

            {/* Πλαστικά */}
            <Card className="p-3 mb-3 border-0 shadow-sm">
              <Form.Check
                type="checkbox"
                label="Χωρίς πλαστικά μαχαιροπίρουνα"
                checked={noPlastic}
                onChange={(e) => setNoPlastic(e.target.checked)}
              />
              <small className="text-muted">
                Εάν δε θέλεις να συμπεριληφθούν πλαστικά μαχαιροπίρουνα στην
                παραγγελία σου, επίλεξε το κουτάκι.
              </small>
            </Card>

            {/* Σχόλια */}
            <Card className="p-3 mb-3 border-0 shadow-sm">
              <Form.Label className="fw-bold">Σχόλιο παραγγελίας</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Π.χ. Χτυπήστε κουδούνι, 2ος όροφος"
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Submit */}
      <div
  className="fixed-bottom bg-white border-top px-4 py-3 d-flex justify-content-center"
  style={{ zIndex: 1050 }}
>
  <Button
    variant="success"
    size="lg"
    onClick={handleSubmit}
    style={{ minWidth: "280px", fontWeight: "bold" }}
  >
    Αποστολή Παραγγελίας  €{total.toFixed(2)}
  </Button>
</div>

      {/* Modal επεξεργασίας */}
      <ProductModal
        show={!!selectedProduct}
        onHide={() => {
          setSelectedProduct(null);
          setEditingItemId(null);
        }}
        product={selectedProduct}
        onAddToCart={() => {}}
        onUpdateCart={(item) => {
          updateItemInCart(item);
          setSelectedProduct(null);
          setEditingItemId(null);
        }}
        editingId={editingItemId}
      />
    </div>
  );
}
