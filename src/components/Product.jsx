import React from "react";
import { Card, Button } from "react-bootstrap";


const Product = ({ product, onAddToCart }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Title className="mb-1">{product.name}</Card.Title>
          <Card.Text className="text-muted">Τιμή: €{product.price.toFixed(2)}</Card.Text>
        </div>
        <Button variant="success" onClick={() => onAddToCart(product)}>
          Προσθήκη
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Product;
