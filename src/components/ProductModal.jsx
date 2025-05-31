
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ProductModal = ({ show, onHide, product, onAddToCart,editingId,onUpdateCart }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
  if (product) {
    if (product.quantity) {
      setQuantity(product.quantity);
    }

    if (product.options) {
      setSelectedOptions(product.options);
    }
  }
}, [product]);


  if (!product) return null;

  const handleChange = (sectionTitle, optionName, isMultiple) => {
    setSelectedOptions((prev) => {
      const current = prev[sectionTitle] || [];
      if (isMultiple) {
        if (current.includes(optionName)) {
          return {
            ...prev,
            [sectionTitle]: current.filter((o) => o !== optionName),
          };
        } else {
          return {
            ...prev,
            [sectionTitle]: [...current, optionName],
          };
        }
      } else {
        return {
          ...prev,
          [sectionTitle]: [optionName],
        };
      }
    });
  };

  const calculateTotal = () => {
    let total = product.price * quantity;

    product.customization?.forEach((section) => {
      const selected = selectedOptions[section.title] || [];
      selected.forEach((optName) => {
        const opt = section.options.find((o) => o.name === optName);
        if (opt) total += opt.price * quantity;
      });
    });

    return total.toFixed(2);
  };

  const handleAdd = () => {


  // Δημιουργία του αντικειμένου επιλογών
  const selected = {};

  product.customization?.forEach((section) => {
    const selectedInSection = selectedOptions[section.title];
    if (selectedInSection && selectedInSection.length > 0) {
      selected[section.title] = selectedInSection;
    }
  });

    const finalProduct = {
    ...product,
    id: product.id || `${product.title}-${Date.now()}`, // fallback id
    quantity,
    options: selected,
    price: calculateTotal() / quantity

  };

  if (editingId) {
  // Ενημέρωση υπάρχοντος στο καλάθι
  finalProduct.id = editingId; // Διατήρησε ίδιο id
  onUpdateCart(finalProduct);  // θα σου δείξω μετά τι είναι αυτό
} else {
  onAddToCart(finalProduct);   // Κανονική προσθήκη
}
  
  

  // Debugging (προαιρετικό)
  console.log("🛒 Προσθήκη στο καλάθι:", finalProduct);

  // Προστατευμένη κλήση
  

  // Reset και κλείσιμο modal
  setSelectedOptions({});
  setQuantity(1);
  onHide();
};



  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{product.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{product.description}</p>

        {product.customization?.map((section, idx) => (
          <div key={idx} className="mb-3">
            <strong>{section.title}</strong>
            <div className="form-check">
              {section.options.map((opt, i) => {
                const isMultiple = section.multiple;
                const selected = selectedOptions[section.title] || [];

                const isChecked = selected.includes(opt.name);

                return (
                  <Form.Check
                    key={i}
                    type={isMultiple ? "checkbox" : "radio"}
                    label={`${opt.name} (€${opt.price.toFixed(2)})`}
                    name={section.title}
                    checked={isChecked}
                    disabled={opt.disabled}
                    onChange={() =>
                      handleChange(section.title, opt.name, isMultiple)
                    }
                  />
                );
              })}
            </div>
          </div>
        ))}

        <div className="d-flex align-items-center justify-content-between mt-4">
          <div>
            Ποσότητα:&nbsp;
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </Button>
            <span className="mx-2">{quantity}</span>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </Button>
          </div>
          <div>
            Σύνολο: <strong>€{calculateTotal()}</strong>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Άκυρο
        </Button>
        <Button variant="success" onClick={handleAdd}>
  {editingId ? "Αποθήκευση αλλαγών" : "Προσθήκη στο καλάθι"}
</Button>

      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
