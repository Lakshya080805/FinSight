import { useState } from "react";

export default function Sidebar({ userName, onLogout, activeView, onNavigate }) {
  const go = (view) => {
    if (onNavigate) onNavigate(view);
  };

  return (
    <aside className="sidebar">
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
        <button className="nav-item" onClick={() => go("dashboard")}>
          <span className="icon">C</span> Cash Flow
        </button>
      </div>

      <div className="nav-section" style={{ marginTop: 12 }}>
        <div className="nav-label">Intelligence</div>
        <button className="nav-item" onClick={() => go("dashboard")}>
          <span className="icon">AI</span> AI Insights
        </button>
        <button className="nav-item" onClick={() => go("dashboard")}>
          <span className="icon">F</span> Forecasting
        </button>
        <button className="nav-item" onClick={() => go("dashboard")}>
          <span className="icon">!</span> Alerts
          <span
            style={{
              marginLeft: "auto",
              background: "var(--danger)",
              color: "#fff",
              fontSize: 10,
              padding: "1px 6px",
              borderRadius: 20,
              fontWeight: 700,
            }}
          >
            3
          </span>
        </button>
      </div>

      <div className="nav-section" style={{ marginTop: 12 }}>
        <div className="nav-label">Reports</div>
        <button className="nav-item" onClick={() => go("dashboard")}>
          <span className="icon">P</span> P&L Statement
        </button>
        <button className="nav-item" onClick={() => go("dashboard")}>
          <span className="icon">TX</span> Tax Summary
        </button>
        <button className="nav-item" onClick={() => go("dashboard")}>
          <span className="icon">S</span> Settings
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="profile-card">
          <div className="business-badge">
            <div className="biz-avatar">
              {(userName || "A").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="biz-name">{userName || "Arjun's Store"}</div>
              <div className="biz-plan">Pro Plan *</div>
            </div>
          </div>
          <button className="btn btn-ghost logout-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
