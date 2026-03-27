import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const formatMoney = (value) =>
  `?${Number(value || 0).toLocaleString("en-IN")}`;

export default function PLPage({ onLogout, user, onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/dashboard")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching P&L:", err);
        if (err?.response?.status === 401 && onLogout) {
          onLogout();
          return;
        }
        setLoading(false);
      });
  }, [onLogout]);

  const rows = useMemo(() => data?.monthlyTrends || [], [data]);

  const summary = useMemo(() => {
    if (!data) return null;
    const revenue = data.revenue || 0;
    const expenses = data.expenses || 0;
    const profit = data.profit || 0;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    return { revenue, expenses, profit, margin };
  }, [data]);

  const maxValue = useMemo(() => {
    return Math.max(
      1,
      ...rows.map((r) => Math.max(r.income, r.expenses, Math.abs(r.profit)))
    );
  }, [rows]);

  return (
    <div className="layout">
      <Sidebar
        userName={user?.businessName || user?.name}
        onLogout={onLogout}
        activeView="pl"
        onNavigate={onNavigate}
      />

      <main className="main">
        <Topbar onLogout={onLogout} userName={user?.name} />

        {loading ? (
          <div style={{ padding: 20 }}>Loading P&L...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">P&L Summary</div>
                <span className="card-badge">All Time</span>
              </div>
              {summary && (
                <div className="pl-summary">
                  <div className="pl-item">
                    <div className="pl-label">Revenue</div>
                    <div className="pl-value">{formatMoney(summary.revenue)}</div>
                  </div>
                  <div className="pl-item">
                    <div className="pl-label">Expenses</div>
                    <div className="pl-value">{formatMoney(summary.expenses)}</div>
                  </div>
                  <div className="pl-item">
                    <div className="pl-label">Net Profit</div>
                    <div className="pl-value">{formatMoney(summary.profit)}</div>
                  </div>
                  <div className="pl-item">
                    <div className="pl-label">Profit Margin</div>
                    <div className="pl-value">{summary.margin.toFixed(1)}%</div>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Monthly P&L Bar Graph</div>
                <span className="card-badge">Income vs Expenses</span>
              </div>
              <div className="pl-bars">
                {rows.map((r) => (
                  <div className="pl-bar-row" key={r.label}>
                    <div className="pl-bar-label">{r.label}</div>
                    <div className="pl-bar-track">
                      <div
                        className="pl-bar income"
                        style={{ width: `${(r.income / maxValue) * 100}%` }}
                        title={`Income: ${formatMoney(r.income)}`}
                      />
                      <div
                        className="pl-bar expenses"
                        style={{ width: `${(r.expenses / maxValue) * 100}%` }}
                        title={`Expenses: ${formatMoney(r.expenses)}`}
                      />
                      <div
                        className="pl-bar profit"
                        style={{ width: `${(Math.abs(r.profit) / maxValue) * 100}%` }}
                        title={`Profit: ${formatMoney(r.profit)}`}
                      />
                    </div>
                    <div className="pl-bar-values">
                      <span>{formatMoney(r.income)}</span>
                      <span>{formatMoney(r.expenses)}</span>
                      <span>{formatMoney(r.profit)}</span>
                    </div>
                  </div>
                ))}
                {!rows.length && (
                  <div className="compare-empty">No P&L data available.</div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">P&L Table</div>
                <span className="card-badge">Monthly Details</span>
              </div>
              <div className="compare-table">
                <div className="compare-row head">
                  <span>Month</span>
                  <span>Income</span>
                  <span>Expenses</span>
                  <span>Profit</span>
                  <span>Margin</span>
                </div>
                {rows.map((r) => {
                  const margin = r.income > 0 ? (r.profit / r.income) * 100 : 0;
                  return (
                    <div className="compare-row" key={r.label}>
                      <span>{r.label}</span>
                      <span>{formatMoney(r.income)}</span>
                      <span>{formatMoney(r.expenses)}</span>
                      <span>{formatMoney(r.profit)}</span>
                      <span>{margin.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
