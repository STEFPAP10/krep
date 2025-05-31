import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import "/root.css";
import { io } from "socket.io-client";
import OrderModal from "../../components/OrderModal";



export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [deliveryTimes, setDeliveryTimes] = useState({});
  const token = localStorage.getItem("token");
  const [activeOrder, setActiveOrder] = useState(null);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleComplete = (id) => {
    const time = deliveryTimes[id];
    if (!time) return alert("⚠️ Επέλεξε χρόνο παράδοσης πρώτα");

    fetch(`http://localhost:5000/api/orders/${id}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryTime: time })
    })
      .then(() => setOrders((prev) => prev.filter((o) => o._id !== id)))
      .catch(() => alert("❌ Αποτυχία ολοκλήρωσης παραγγελίας"));
  };

  const handleReject = (id) => {
    if (!window.confirm("Απόρριψη παραγγελίας;")) return;
    fetch(`http://localhost:5000/api/orders/${id}/reject`, {
      method: "PATCH",
    })
      .then(() => setOrders((prev) => prev.filter((o) => o._id !== id)))
      .catch(() => alert("❌ Αποτυχία απόρριψης"));
  };

  useEffect(() => {
  fetch("http://localhost:5000/api/orders?status=pending", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setOrders(data.orders || []))
    .catch(() => console.error("Αποτυχία φόρτωσης παραγγελιών"));

  const socket = io("http://localhost:5000");

  const handleNewOrder = (newOrder) => {
    const audio = new Audio("/sounds/alarm-clock-90867.mp3");
    audio.play().catch(() => {});
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
  };

  socket.on("new-order", handleNewOrder);

  return () => {
    socket.off("new-order", handleNewOrder);
    socket.disconnect();
  };
}, []);

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-md-3 col-lg-2 bg-sidebar text-white p-3">
          <h4 className="mb-4">Το Κρεπάκι</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button
                className="nav-link active text-white btn btn-link text-start"
                onClick={() => navigate("/admin/orders")}
              >
                Παραγγελίες
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white-50 btn btn-link text-start"
                onClick={() => navigate("/admin/completed-orders")}
              >
                Ολοκληρωμένες
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white-50 btn btn-link text-start"
                onClick={() => navigate("/admin/products")}
              >
                Μενού
              </button>
            </li>
            <li className="nav-item mt-4">
              <button
                className="btn btn-outline-light w-100"
                onClick={handleLogout}
              >
                Αποσύνδεση
              </button>
            </li>
          </ul>
        </div>  
                      <div className="col-md-9 col-lg-10 p-4">
  <h3 className="mb-4">Νέες Παραγγελίες</h3>
  {orders.map((order) => (
    <Card key={order._id} className="mb-3 shadow-sm">
      <Card.Body>
        <h5>#{order._id}</h5>
        <p><strong>Όνομα:</strong> {order.customer.firstName} {order.customer.lastName}</p>
        <p><strong>Τηλέφωνο:</strong> {order.customer.address.phone}</p>
      <p><strong>Σχόλια:</strong> {order.customer.address.notes}</p>

        <Button variant="outline-primary" onClick={() => setActiveOrder(order)}>
          Προβολή
        </Button>
      </Card.Body>
    </Card>
  ))}
</div>



      </div>
      <OrderModal
  show={!!activeOrder}
  order={activeOrder}
  onClose={() => setActiveOrder(null)}
  onConfirm={() => {
    fetch(`http://localhost:5000/api/orders/${activeOrder._id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        setActiveOrder(null);
        // Αν θες, αφαίρεσε την επιβεβαιωμένη από τη λίστα
        setOrders((prev) => prev.filter((o) => o._id !== activeOrder._id));
      })
      .catch(() => alert("❌ Σφάλμα επιβεβαίωσης"));
  }}
/>

    </div>

    
  );
}
