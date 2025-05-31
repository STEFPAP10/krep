import React, { useState, useEffect } from "react";
import logo from "../assets/krepaki-logo.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserTie } from "react-icons/fa";
import AddressDropdown from "./AddressDropdown";

const Header = () => {
  const [selectedAddress, setSelectedAddress] = useState("Επιλέξτε διεύθυνση");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const token = localStorage.getItem("token");

  const [userName, setUserName] = useState("Χρήστης");

useEffect(() => {
  if (!token) return;

  fetch("http://localhost:5000/api/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.user) {
        const fullName = `${data.user.username} ${data.user.lastname}`;
        setUserName(fullName);
      }
    })
    .catch((err) => console.error("❌ User fetch error:", err.message));
}, [token]);


  // ✅ Φέρνουμε την τελευταία αποθηκευμένη διεύθυνση από το backend
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/addresses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Διεύθυνση από backend:", data.addresses[0]);
        if (data.addresses && data.addresses.length > 0) {
          const latest = data.addresses[0];
          const label = `${latest.road} ${latest.house_number || ""}`;
          setSelectedAddress(label);
        }
      })
      .catch((err) => {
        console.error("❌ Address fetch error:", err.message);
      });
  }, [token]);

  return (
    <>
      <div
        className="container-fluid d-flex justify-content-between align-items-center px-4 py-2 shadow-sm"
        style={{ backgroundColor: "#FAFAF3" }}
      >
        {/* Logo + Address */}
        <div className="d-flex align-items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            style={{ width: "100px", height: "auto" }}
          />

          <div
            className="d-flex align-items-center gap-2"
            style={{ cursor: "pointer" }}
            onClick={() => setShowAddressModal(true)}
          >
            <FaMapMarkerAlt size={18} />
            <div>
              <small className="text-muted">Διεύθυνση παράδοσης</small>
              <br />
<strong>
  {selectedAddress.road} {selectedAddress.house_number}
</strong>
              </div>
            <IoIosArrowDown />
          </div>
        </div>

        {/* User avatar + name */}
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-warning d-flex justify-content-center align-items-center"
            style={{ width: 35, height: 35 }}
          >
            <FaUserTie size={18} />
          </div>
          <strong>{userName}</strong>
        </div>
      </div>

      {/* Modal για διευθύνσεις */}
      <AddressDropdown
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelect={(address) => {
          setSelectedAddress(address);
          setShowAddressModal(false);
        }}
      />
    </>
  );
};

export default Header;
