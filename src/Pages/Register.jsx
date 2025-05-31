import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/root.css"; // φρόντισε να έχεις αυτό το αρχείο

export default function Register() {
  const [username, setUsername] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !lastname || !email || !password) {
      return setMessage("Συμπλήρωσε όλα τα πεδία.");
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, lastname, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setMessage(data.message || "Σφάλμα κατά την εγγραφή.");
      }

      setMessage("Εγγραφή επιτυχής!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Κάτι πήγε στραβά.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Εγγραφή</h1>

        {message && (
          <div className={message.includes("επιτυχής") ? "success" : "error"}>
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Όνομα"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="text"
          placeholder="Επώνυμο"
          className="form-control"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />

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

        <button className="btn-green" onClick={handleRegister}>
          Εγγραφή
        </button>

        <p className="remember-link">
          Έχεις ήδη λογαριασμό; <a href="/login">Σύνδεση</a>
        </p>
      </div>
    </div>
  );
}
