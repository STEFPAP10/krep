import React from "react";
import { Button } from "react-bootstrap";

const ProductCard = ({ product, onAddToCart }) => {
  const price = product.price ?? 0; // προστασία
  const handleAdd = () => {
    if (onAddToCart && typeof onAddToCart === "function") {
      onAddToCart(product);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center border-bottom py-3">
      <div style={{ maxWidth: "70%" }}>
        <h6 className="fw-bold">{product.title}</h6>
        <p className="text-muted mb-1" style={{ fontSize: "0.9em" }}>
          {product.description}
        </p>
        <div className="text-dark">Από €{price.toFixed(2)}</div>
      </div>

      <div style={{ position: "relative", width: "100px", height: "70px" }}>
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        <Button
          variant="light"
          size="sm"
          onClick={handleAdd}
          style={{
            position: "absolute",
            bottom: "-10px",
            right: "-10px",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            fontSize: "1.2em",
            padding: 0,
            boxShadow: "0 0 5px rgba(0,0,0,0.2)",
          }}
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
