import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const AddressDetailsPanel = ({ address, onSave }) => {
  const [houseNumber, setHouseNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [buzzer, setBuzzer] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
   if (!address) return null;
  // ✅ Φόρτωση αρχικών τιμών από τη βάση
  useEffect(() => {
    setHouseNumber(address.house_number || "");
    setFloor(address.floor || "");
    setBuzzer(address.buzzer || "");
    setPhone(address.phone || "");
    setNotes(address.notes || "");
  }, [address]);

  const handleSave = () => {
    // ✅ Έλεγχος αριθμού τηλεφώνου
    const isValidPhone = /^\+?30\d{10}$/.test(phone.trim());
    if (!isValidPhone) {
      alert("Μη έγκυρος αριθμός τηλεφώνου. Μορφή: +3069XXXXXXX");
      return;
    }

    const enrichedAddress = {
      ...address,
      house_number: houseNumber,
      floor,
      buzzer,
      phone,
      notes,
    };

    onSave(enrichedAddress);
  };

  return (
    <div>
      <h5 className="fw-bold">Στοιχεία παράδοσης</h5>

      <p className="mb-3">
        {address.road}
        {houseNumber ? ` ${houseNumber}` : ""}
        , {address.city}
      </p>

      <Form.Group className="mb-2">
        <Form.Label>Αριθμός</Form.Label>
        <Form.Control
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
          placeholder="π.χ. 10"
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Όροφος</Form.Label>
        <Form.Control
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          placeholder="π.χ. ισόγειο, 1ος"
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Όνομα στο κουδούνι</Form.Label>
        <Form.Control
          value={buzzer}
          onChange={(e) => setBuzzer(e.target.value)}
          placeholder="π.χ. Παπαδόπουλος"
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Τηλ. επικοινωνίας</Form.Label>
        <Form.Control
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+3069XXXXXXX"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Σχόλια διεύθυνσης</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="π.χ. Πάρε με τηλ. και θα βγω"
        />
      </Form.Group>

      <Button variant="success" onClick={handleSave}>
        Αποθήκευση αλλαγών
      </Button>
    </div>
  );
};

export default AddressDetailsPanel;
