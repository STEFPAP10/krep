import { useNavigate } from "react-router-dom";
import logo from "./../assets/krepaki-logo.png";
import "/root.css"; // βεβαιώσου ότι υπάρχει αυτό το path

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid welcome-page text-center p-4">
      <div className="pt-5">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="welcome-title">ΤΟ ΚΡΕΠΑΚΙ</h1>
        <p className="subtitle">κρέπα · σάντουιτς</p>
      </div>

      <div className="mt-auto">
        <button
          className="welcome-button btn-outline-green"
          onClick={() => navigate("/login")}
        >
          Είσοδος
        </button>
        <button
          className="welcome-button btn-green"
          onClick={() => navigate("/register")}
        >
          Ξεκίνα
        </button>
      </div>

      <footer className="mt-5">© 2025 Το Κρεπάκι</footer>
    </div>
  );
}
