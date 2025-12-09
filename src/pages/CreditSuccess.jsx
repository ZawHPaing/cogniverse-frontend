import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyPaymentSession } from "../api/api";
import NavProduct from "../components/NavProduct";
import "../profile-nav.css";
import "../credit.css";

// 🌓 theme hook (same logic as Credit.jsx)
function useTheme() {
  const [theme, setTheme] = React.useState(
    () => localStorage.getItem("theme") || "light"
  );
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return { theme, toggle };
}

export default function CreditSuccess() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [params] = useSearchParams();
  const [status, setStatus] = useState("Verifying your payment...");
  const sessionId = params.get("session_id");

  useEffect(() => {
    async function verify() {
      try {
        const res = await verifyPaymentSession(sessionId);
        setStatus(`✅ Payment successful! ${res.credits_added || 0} credits added.`);
      } catch {
        setStatus("✅ Payment successful! Credits will appear shortly.");
      }
    }
    if (sessionId) verify();
  }, [sessionId]);

  return (
    <div className="credit-page">
      <NavProduct
        theme={theme}
        onToggleTheme={toggleTheme}
        active="credit"
        onGoWorkstation={() => (window.location.href = "/workstation")}
        onGoGraph={() => (window.location.href = "/graph")}
        onGoHistory={() => (window.location.href = "/history")}
      />

      <main className="credit-wrap center-card">
        <div className="success-card ">
          <h2 className="credit-title">{status}</h2>
          <p className="credit-sub">Thank you for your purchase!</p>
          <button
            type="button"
            className="btn primary"
            onClick={() => (window.location.href = "/credit")}
          >
            Back to Credit Page
          </button>
        </div>
      </main>

      <footer className="credit-footer">
        <p>© CogniVerse</p>
      </footer>
    </div>
  );
}
