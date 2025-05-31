// src/components/Cart.jsx
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const Cart = ({ cart, onQuantityChange, total ,onItemClick ,showCheckoutButton = true}) => {
  const navigate = useNavigate();
  const [showAllItems, setShowAllItems] = useState(false);
const displayedItems = showAllItems ? cart : cart.slice(0, 5);


  return (
    <div className="border p-3 bg-light rounded shadow-sm sticky-top" style={{ top: "80px" }}>
      {cart.length === 0 ? (
        <div className="text-center text-muted">
          <img src="/images/empty-basket.png" alt="Άδειο καλάθι" style={{ width: "60px" }} />
          <p className="mt-2">Άδειο Καλάθι</p>
          <small>Γέμισε το καλάθι σου με τα προϊόντα που βρίσκονται αριστερά</small>
        </div>
      ) : (
        <>
          <h5>🛒 Καλάθι ({cart.length} είδη)</h5>
          <ul className="list-unstyled">
            {displayedItems.map((item, i) => {
              const safePrice = Number(item.price) || 0;
              console.log(item.price);
              return (
                <li key={i} className="d-flex justify-content-between align-items-center py-2 border-bottom"
                 onClick={()=>onItemClick(item)} 
                 style={{cursor:"pointer"}}>
                  <div style={{ flex: 1 }}>
                    {/* Ποσότητα controls */}
                    <div className="d-flex align-items-center mb-1">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuantityChange(item.id, -1);
                        }}
                      >
                        −
                      </Button>
                          <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuantityChange(item.id, 1);
                        }}
                      >
                        +
                      </Button>

                    </div>
                    {/* Τίτλος και τιμή */}
                    <div>
                      <strong>{item.title}</strong>
                      <div className="text-muted small">
                        €{safePrice.toFixed(2)}
                      </div>
                    </div>
                    {/* Επιλογές από modal */}
{item.options &&
  Object.entries(item.options).map(([section, choices], idx) => (
    <div key={idx} className="text-muted small">
      {section}: {choices.join(", ")}
    </div>
  ))
}

                  </div>

                  {/* Εικόνα προϊόντος */}
                  <div style={{ width: "60px", height: "60px" }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid rounded"
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          {cart.length > 5 && (
  <Button
  size="sm"
  className="px-3 py-1 rounded-pill shadow-sm border-0"
  style={{
    fontSize: "0.85rem",
    fontWeight: "500",
    backgroundColor: "var(--krepaki-green)",
    color: "white",
  }}
  onClick={() => setShowAllItems(!showAllItems)}
>
  {showAllItems ? "➖ Απόκρυψη" : `🔽 Προβολή όλων (${cart.length})`}
</Button>

)}


          {/* Σύνολο */}
          <h6 className="text-end mt-3">
            Σύνολο: €{(Number(total) || 0).toFixed(2)}
          </h6>

          {/* Κουμπί Checkout */}
          {showCheckoutButton && (
  <Button
    variant="success"
    className="w-100 mt-3"
    onClick={() => navigate("/checkout")}
  >
    Ολοκλήρωση παραγγελίας
  </Button>
  
)}

        </>
      )}
    </div>
  );
};

export default Cart;
