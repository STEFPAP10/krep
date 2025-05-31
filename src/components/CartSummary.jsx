import React from "react";
import { Card } from "react-bootstrap";

export default function CartSummary({ cart = [], total = 0 }) {
  return (
    <Card className="p-3 mb-3">
      {cart.length === 0 ? (
        <p>Το καλάθι είναι άδειο.</p>
      ) : (
        <>
          {cart.map((item, i) => (
            <div key={i} className="d-flex justify-content-between mb-1">
              <span>{item.title} x{item.quantity}</span>
              <strong>€{(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          ))}
          <hr />
          <div className="d-flex justify-content-between">
            <span>Σύνολο:</span>
            <strong>€{total.toFixed(2)}</strong>
          </div>
        </>
      )}
    </Card>
  );
}
