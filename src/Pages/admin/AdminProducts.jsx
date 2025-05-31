import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-sidebar text-white p-3">
          <h4 className="mb-4">Το Κρεπάκι</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button
                className="nav-link text-white-50 btn btn-link text-start"
                onClick={() => navigate("/admin/orders")}
              >
                Παραγγελίες
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white-50 btn btn-link text-start"
                onClick={() => navigate("/admin/completed-orders")}
              >
                Ολοκληρωμένες
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link active text-white btn btn-link text-start"
                onClick={() => navigate("/admin/products")}
              >
                Μενού
              </button>
            </li>
            <li className="nav-item mt-4">
              <button className="btn btn-outline-light w-100" onClick={handleLogout}>
                Αποσύνδεση
              </button>
            </li>
          </ul>
        </div>

        {/* Περιεχόμενο */}
        <div className="col-md-9 col-lg-10 p-4 bg-content">
          <h3 className="mb-4">Διαχείριση Μενού</h3>

          <div className="row">
            {/* Προϊόντα */}
            <div className="col-md-4">
              <div className="list-group">
                {products.map((product) => (
                  <button
                    key={product._id}
                    className={`list-group-item list-group-item-action ${
                      selectedProduct?._id === product._id ? "active" : ""
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Υλικά */}
            <div className="col-md-8">
              {selectedProduct ? (
                <>
                  <h5 className="fw-bold mb-3">{selectedProduct.title}</h5>
                  {selectedProduct.customization?.length > 0 ? (
                    selectedProduct.customization.map((section, i) => (
                      <div key={i} className="mb-4 p-3 border rounded bg-light-subtle">
                        <h6 className="fw-bold mb-3 border-bottom">{section.title}</h6>
                        <ul className="list-group list-group-flush">
                          {section.options.map((opt, j) => (
                            <li
                              key={j}
                              className={`list-group-item d-flex justify-content-between align-items-center ${
                                opt.disabled ? "text-muted bg-light" : ""
                              }`}
                              style={{ cursor: "pointer" }}
                              onClick={async () => {
                                console.log("sending", {
  productId: selectedProduct._id,
  sectionTitle: section.title,
  optionName: opt.name,
});

                                const res = await fetch(
                                  `http://localhost:5000/api/products/toggle-option`,
                                  {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      productId: selectedProduct._id,
                                      sectionTitle: section.title,
                                      optionName: opt.name,
                                    }),
                                  }
                                );

                                if (res.ok) {
                                  const data = await res.json();
                                  setSelectedProduct(data.product);
                                   console.log("response", data)
                                } else {
                                  alert("Αποτυχία ενημέρωσης υλικού");
                                }
                              }}
                            >
                              {opt.name}
                              <span
                                className={`badge ${
                                  opt.disabled ? "bg-danger" : "bg-success"
                                }`}
                              >
                                €{opt.price?.toFixed(2)}
                              </span>
                            </li>
                          ))}
                          {section.options.length === 0 && (
                            <li className="list-group-item text-muted">Χωρίς υλικά</li>
                          )}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Δεν έχουν οριστεί υλικά.</p>
                  )}
                </>
              ) : (
                <p className="text-muted">Επιλέξτε προϊόν από αριστερά για να δείτε τα υλικά.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;

