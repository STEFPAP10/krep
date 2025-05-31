// src/api/addresses.js

export async function fetchUserAddresses() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/addresses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  return data.addresses || [];
}
