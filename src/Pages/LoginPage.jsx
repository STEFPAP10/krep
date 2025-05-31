import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/root.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const adminEmail = "admin@krepaki.gr"; // ✏️ άλλαξέ το αν χρειάζεται

  const handleLogin = async () => {
    // ✅ Κενά πεδία
    if (!email || !password || (role === "admin" && !pin)) {
      setMessage("Συμπλήρωσε όλα τα πεδία.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    // ✅ Έλεγχος ρόλου ανά email
    if (email.toLowerCase() === adminEmail && role !== "admin") {
      setMessage("Επέλεξε 'Κατάστημα' για να μπεις ως admin.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (email.toLowerCase() !== adminEmail && role === "admin") {
      setMessage("Ο λογαριασμός αυτός δεν είναι Κατάστημα.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    // ✅ Έλεγχος PIN για admin
    if (role === "admin" && pin !== "krepaki") {
      setMessage("Λάθος PIN για Κατάστημα.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    // 🔄 Αποστολή στο backend
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Σφάλμα κατά τη σύνδεση.");
        setTimeout(() => setMessage(""), 2000);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      setMessage("Σύνδεση επιτυχής!");
      setTimeout(() => {
        setMessage("");
        navigate(data.role === "admin" ? "/admin/orders" : "/user/menu");
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Σφάλμα διακομιστή.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Σύνδεση</h2>

        {message && (
          <div className={message.includes("επιτυχής") ? "success" : "error"}>
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Κωδικός"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="role-select">
          <label>
            <input
              type="radio"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />
            &nbsp;Πελάτης
          </label>
          <label>
            <input
              type="radio"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />
            &nbsp;Κατάστημα
          </label>
        </div>

        {role === "admin" && (
          <input
            type="password"
            placeholder="PIN Καταστήματος"
            className="form-control"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        )}

        <button className="btn-green mt-2" onClick={handleLogin}>
          Σύνδεση
        </button>
      </div>
    </div>
  );
}
