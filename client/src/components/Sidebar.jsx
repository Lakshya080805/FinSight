import { useEffect, useState } from "react";

export default function Sidebar({ userName, onLogout, activeView, onNavigate }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "light" ? "light" : "dark";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
    return () => document.body.classList.remove("sidebar-open");
  }, [mobileOpen]);

  const go = (view) => {
    if (onNavigate) onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <div className="sidebar-shell">
      <div className="sidebar-mobilebar">
        <button
          className={`hamburger ${mobileOpen ? "open" : ""}`}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="sidebar-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="sidebar-mobiletitle">FinSight</div>
      </div>

      <button
        className={`sidebar-backdrop ${mobileOpen ? "open" : ""}`}
        type="button"
        aria-label="Close menu"
        onClick={() => setMobileOpen(false)}
      ></button>

      <aside
        className={`sidebar ${mobileOpen ? "open" : ""}`}
        id="sidebar-menu"
      >
        <div className="logo">
          <div className="logo-mark">FinSight</div>
          <div className="logo-sub">AI Financial Assistant</div>
        </div>

      <div className="nav-section">
        <div className="nav-label">Overview</div>
        <button
          className={`nav-item ${activeView === "dashboard" ? "active" : ""}`}
          onClick={() => go("dashboard")}
        >
          <span className="icon">D</span> Dashboard
        </button>
        <button
          className={`nav-item ${activeView === "transactions" ? "active" : ""}`}
          onClick={() => go("transactions")}
        >
          <span className="icon">T</span> Transactions
        </button>
        <button
          className={`nav-item ${activeView === "cashflow" ? "active" : ""}`}
          onClick={() => go("cashflow")}
        >
          <span className="icon">C</span> Cash Flow
        </button>
      </div>

      <div className="nav-section" style={{ marginTop: 12 }}>
        <div className="nav-label">Intelligence</div>
        <button
          className={`nav-item ${activeView === "insights" ? "active" : ""}`}
          onClick={() => go("insights")}
        >
          <span className="icon">AI</span> AI Insights
        </button>
        <button
          className={`nav-item ${activeView === "chatbot" ? "active" : ""}`}
          onClick={() => go("chatbot")}
        >
          <span className="icon">CB</span> AI Chatbot
        </button>
      </div>

      <div className="nav-section" style={{ marginTop: 12 }}>
        <div className="nav-label">Reports</div>
        <button
          className={`nav-item ${activeView === "pl" ? "active" : ""}`}
          onClick={() => go("pl")}
        >
          <span className="icon">P</span> P&L Statement
        </button>
        <button
          className={`nav-item ${activeView === "tax" ? "active" : ""}`}
          onClick={() => go("tax")}
        >
          <span className="icon">TX</span> Tax Summary
        </button>
        <button className="nav-item" onClick={() => go("dashboard")}>
          <span className="icon">S</span> Settings
        </button>
        <div className="theme-toggle">
          <span>Day / Night</span>
          <button
            className={`toggle-track ${theme === "light" ? "light" : "dark"}`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle day and night mode"
          >
            <span className="toggle-thumb"></span>
          </button>
        </div>
      </div>

        <div className="sidebar-footer">
          <div className="profile-card">
            <div className="business-badge">
              <div className="biz-avatar">
                {(userName || "A").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="biz-name">{userName || "Arjun's Store"}</div>
              </div>
            </div>
            <button className="btn btn-ghost logout-btn" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
