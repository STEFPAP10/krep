// 👇 Όλα τα imports παραμένουν ίδια
import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { FaMapMarkerAlt, FaCog, FaThumbtack, FaTrashAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import AddressDetailsPanel from "./AddressDetailsPanel";

const AddressDropdown = ({ show, onClose, onSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [selectedForMap, setSelectedForMap] = useState(null);
  const [addressHistory, setAddressHistory] = useState([]);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [selectedRawAddress, setSelectedRawAddress] = useState(null);
  const [selectedForEdit, setSelectedForEdit] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/addresses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAddressHistory(data.addresses || []))
      .catch((err) => console.error("❌ Load error:", err.message));
  }, [token, show]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (inputValue.length > 2) {
        const query = encodeURIComponent(`${inputValue}, Άρτα, Ελλάδα`);
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1`
        )
          .then((res) => res.json())
          .then((data) => {
            const filtered = data.filter(
              (place) =>
                place.address &&
                place.address.road &&
                (place.address.city || place.address.town)
            );
            setResults(filtered);
          });
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  const handleSelect = (place) => {
    const isFromBackend = !place.display_name;

    const road = place.road || place.address?.road;
    const house_number = place.house_number || place.address?.house_number;
    const city = place.city || place.address?.city || place.address?.town;
    const lat = place.lat;
    const lon = place.lon;
    const display_name =
      place.display_name || `${road} ${house_number || ""}, ${city}`;

    const addressObject = {
      ...place,
      road,
      house_number,
      city,
      lat,
      lon,
      display_name,
    };

    setSelectedRawAddress(addressObject);
    setShowDetailsPanel(true);
    setInputValue("");
    setResults([]);
  };

  return (
  <>
    {/* 🔍 Modal αναζήτησης */}
    <Modal show={show} onHide={onClose} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Αναζήτησε Διεύθυνση</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Π.χ. Σκουφά 10"
          className="mb-3"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        {/* 📜 Ιστορικό */}
        {addressHistory.length > 0 && (
          <div className="mb-3">
            <div className="text-muted fw-bold mb-2">📍 Αποθηκευμένες διευθύνσεις</div>
            {addressHistory.map((addr, i) => (
              <div
                key={i}
                className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer", backgroundColor: "#f8f9fa" }}
                onClick={() => {
                  const label = `${addr.road} ${addr.house_number || ""}`;
                  onSelect(addr);
                }}
              >
                <div className="d-flex align-items-start">
                  <FaMapMarkerAlt className="me-2 text-success mt-1" />
                  <div>
                    <div className="fw-bold">
                      {addr.road} {addr.house_number || ""}
                    </div>
                    <small className="text-muted">({addr.city})</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {/* 📌 Κύρια */}
                  <FaThumbtack
                    className="text-muted"
                    title="Ορισμός ως κύρια"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("🔜 Coming soon: Ορισμός κύριας διεύθυνσης!");
                    }}
                  />

                  {/* ⚙️ Επεξεργασία */}
                  <FaCog
                    className="text-muted"
                    title="Επεξεργασία"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedForEdit(addr);
                      setShowDetailsPanel(true);
                    }}
                  />

                  {/* 🗑️ Διαγραφή */}
                  <FaTrashAlt
                    className="text-danger"
                    title="Διαγραφή"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const confirmDelete = window.confirm("Θέλεις σίγουρα να διαγράψεις αυτή τη διεύθυνση;");
                      if (!confirmDelete) return;

                      fetch(`http://localhost:5000/api/addresses/${addr._id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                      })
                        .then((res) => {
                          if (res.ok) {
                            setAddressHistory((prev) =>
                              prev.filter((a) => a._id !== addr._id)
                            );
                          } else {
                            alert("⚠️ Σφάλμα κατά τη διαγραφή.");
                          }
                        })
                        .catch((err) => console.error("❌ Delete error:", err.message));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔎 Αποτελέσματα αναζήτησης */}
        {results.map((place, idx) => (
          <div
            key={idx}
            className="border rounded p-2 mb-2 d-flex justify-content-between"
            style={{ cursor: "pointer" }}
            onClick={() => handleSelect(place)}
          >
            <div className="d-flex">
              <FaMapMarkerAlt className="me-2 text-secondary mt-1" />
              <div>
                <div className="fw-bold">
                  {place.address.road} {place.address.house_number || ""}
                </div>
                <small className="text-muted">
                  ({place.address.city || place.address.town || "Άγνωστη πόλη"})
                </small>
              </div>
            </div>
            <FaCog
              className="text-muted mt-1"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedForMap(place);
              }}
            />
          </div>
        ))}

        {inputValue.length > 2 && results.length === 0 && (
          <p className="text-muted text-center">Καμία διεύθυνση δεν βρέθηκε</p>
        )}
      </Modal.Body>
    </Modal>

    {/* 🗺️ Modal χάρτη */}
    <Modal show={!!selectedForMap} onHide={() => setSelectedForMap(null)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Τοποθεσία στον χάρτη</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "400px" }}>
        {selectedForMap && (
          <MapContainer
            center={[selectedForMap.lat, selectedForMap.lon]}
            zoom={17}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[selectedForMap.lat, selectedForMap.lon]}>
              <Popup>{selectedForMap.display_name}</Popup>
            </Marker>
          </MapContainer>
        )}
      </Modal.Body>
    </Modal>

    {/* 🧾 Panel για νέα ή επεξεργασία */}
    {showDetailsPanel && (
      <Modal show onHide={() => setShowDetailsPanel(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedForEdit ? "Επεξεργασία Διεύθυνσης" : "Συμπλήρωσε Στοιχεία Παράδοσης"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddressDetailsPanel
            address={selectedForEdit || selectedRawAddress}
            onSave={(updatedAddress) => {
              const method = updatedAddress._id ? "PUT" : "POST";
              const url = updatedAddress._id
                ? `http://localhost:5000/api/addresses/${updatedAddress._id}`
                : "http://localhost:5000/api/addresses";

              fetch(url, {
                method,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedAddress),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (updatedAddress._id) {
                    setAddressHistory((prev) =>
                      prev.map((a) => (a._id === data.address._id ? data.address : a))
                    );
                  } else {
                    setAddressHistory((prev) => [data.address, ...prev]);
                  }
                  onSelect(updatedAddress); // ✅ Στέλνει ΟΛΟ το αντικείμενο, μαζί με phone!

                  setShowDetailsPanel(false);
                  setSelectedForEdit(null);
                  setSelectedRawAddress(null);
                })
                .catch((err) => console.error("❌ Save failed:", err.message));
            }}
          />
        </Modal.Body>
      </Modal>
    )}
  </> 
);

};

export default AddressDropdown;
