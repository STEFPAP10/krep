import { useNavigate } from "react-router-dom";
import "/root.css";

export default function CompletedOrders() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 🧪 Mock δεδομένα
  const mockCompletedOrders = [
    {
      id: 1,
      name: "Γιώργος Παπαδόπουλος",
      address: "Ερμού 23, Αθήνα",
      items: ["Κρέπα σοκολάτα", "Καφές φρέντο εσπρέσο"],
      total: "6.50€",
      deliveredAt: "2025-05-24 14:30",
    },
    {
      id: 2,
      name: "Μαρία Κ.",
      address: "Ακαδημίας 12",
      items: ["Σάντουιτς κοτόπουλο", "Νερό"],
      total: "5.00€",
      deliveredAt: "2025-05-24 13:15",
    },
  ];

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
                className="nav-link active text-white btn btn-link text-start"
                onClick={() => navigate("/admin/completed-orders")}
              >
                Ολοκληρωμένες
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white-50 btn btn-link text-start"
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
          <h2 className="mb-4">Ολοκληρωμένες Παραγγελίες</h2>

          {mockCompletedOrders.length === 0 ? (
            <p>Δεν υπάρχουν ακόμη ολοκληρωμένες παραγγελίες.</p>
          ) : (
            mockCompletedOrders.map((order) => (
              <div key={order.id} className="card mb-3 p-3 shadow-sm">
                <h5>{order.name}</h5>
                <p className="text-muted">{order.address}</p>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>
                  <strong>Σύνολο:</strong> {order.total}
                </p>
                <p className="text-muted">Παραδόθηκε: {order.deliveredAt}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
