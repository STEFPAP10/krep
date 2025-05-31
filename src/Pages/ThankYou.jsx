import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

export default function ThankYou() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Φόρτωση της τελευταίας παραγγελίας
  useEffect(() => {
    fetch("http://localhost:5000/api/orders/latest", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
      })
      .catch(() => alert("Αποτυχία φόρτωσης παραγγελίας"));
  }, [token]);

  if (!order) {
    return (
      <div className="container py-5">
        <h4>Φόρτωση παραγγελίας...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">🎉 Ευχαριστούμε για την παραγγελία!</h2>

      <Card className="p-4 shadow-sm">
        <h5 className="mb-3">Λεπτομέρειες Παραγγελίας</h5>

        <p><strong>Όνομα:</strong> {order.customer.firstName} {order.customer.lastName}</p>
        <p><strong>Διεύθυνση:</strong> {order.customer.address.street} {order.customer.address.number}, {order.customer.address.city}</p>
<p><strong>Τηλέφωνο:</strong> {order.customer.address.phone}</p>

        <ul className="mb-3">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.title} × {item.quantity} – €{item.price.toFixed(2)}
              {item.options && (
                <ul>
                  {Object.entries(item.options).map(([group, values], j) => (
                    <li key={j}><strong>{group}:</strong> {values.join(", ")}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {order.comment && <p><strong>Σχόλιο:</strong> {order.comment}</p>}
        {order.noPlastic && <p>🌱 Χωρίς πλαστικά μαχαιροπίρουνα</p>}
        {order.tip > 0 && <p>💸 <strong>Tip:</strong> €{order.tip.toFixed(2)}</p>}
        <p><strong>Σχόλια:</strong> {order.customer.address.notes}</p>


        <h5 className="mt-3">Σύνολο: €{order.total?.toFixed(2)}</h5>
      </Card>

      <div className="text-center mt-4">
        <Button variant="outline-primary" onClick={() => navigate("/menu")}>
          Επιστροφή στο μενού
        </Button>
      </div>
    </div>
  );
}
