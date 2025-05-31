import React from "react";
import { Modal, Button } from "react-bootstrap";


export default function OrderModal({ show, order, onClose, onConfirm }) {
  if (!order) return null;
    console.log(order.customer.address)
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Παραγγελία #{order._id}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* 👤 Πληροφορίες Πελάτη */}
        <p><strong>Όνομα:</strong> {order.customer.firstName} {order.customer.lastName}</p>

        {/* 📍 Διεύθυνση */}
        <p><strong>Διεύθυνση:</strong> {order.customer.address.street} {order.customer.address.number}, {order.customer.address.city}</p>


        {order.customer.address.phone && (
  <p>📞 <strong>Τηλέφωνο:</strong> {order.customer.address.phone}</p>
)}




        {/* 💬 Σχόλιο */}
        {order.comment && (
          <p><strong>Σχόλιο:</strong> {order.comment}</p>
        )}

        {/* ♻️ Χωρίς Πλαστικά */}
        {order.noPlastic && (
          <p>🌱 <strong>Ο πελάτης δε θέλει πλαστικά μαχαιροπίρουνα</strong></p>
        )}

        {/* 💸 Tip */}
        {order.tip > 0 && (
          <p>💸 <strong>Tip:</strong> €{order.tip.toFixed(2)}</p>
        )}

        {/* 🛍 Λίστα Προϊόντων */}
        <h5 className="mt-4">Προϊόντα:</h5>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              {item.title} × {item.quantity} – €{item.price.toFixed(2)}
              {/* Επιλογές */}
              {item.options && (
                <ul>
                  {Object.entries(item.options).map(([group, values], i) => (
                    <li key={i}><strong>{group}:</strong> {values.join(", ")}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* 💰 Σύνολο */}
        <h5 className="mt-4">Σύνολο: €{order.total?.toFixed(2)}</h5>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="success" onClick={onConfirm}>✅ Επιβεβαίωση</Button>
        <Button variant="outline-secondary" onClick={onClose}>❌ Κλείσιμο</Button>
      </Modal.Footer>
    </Modal>
  );
}
