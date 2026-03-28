import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Insights from "../components/Insights";

const formatMoney = (value) =>
  `INR ${Number(value || 0).toLocaleString("en-IN")}`;

export default function InsightsPage({ onLogout, user, onNavigate }) {
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
        console.error("Error fetching insights:", err);
        if (err?.response?.status === 401 && onLogout) {
          onLogout();
          return;
        }
        setLoading(false);
      });
  }, [onLogout]);

  const comparisonRows = useMemo(() => {
    const months = data?.monthlyTrends || [];
    return months.slice(-4).map((m) => {
      const margin = m.income > 0 ? (m.profit / m.income) * 100 : 0;
      return {
        label: m.label,
        income: m.income,
        expenses: m.expenses,
        profit: m.profit,
        margin,
      };
    });
  }, [data]);

  const summary = useMemo(() => {
    if (!data) return null;
    const revenue = data.revenue || 0;
    const expenses = data.expenses || 0;
    const profit = data.profit || 0;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const topCat = (data.expenseBreakdown || [])[0];
    return {
      revenue,
      expenses,
      profit,
      profitMargin,
      topCat,
      cashFlowTrend: data.cashFlowSeries?.[data.cashFlowSeries.length - 1]?.value,
    };
  }, [data]);

  return (
    <div className="layout">
      <Sidebar
        userName={user?.businessName || user?.name}
        onLogout={onLogout}
        activeView="insights"
        onNavigate={onNavigate}
      />

      <main className="main">
        <Topbar onLogout={onLogout} userName={user?.name} />

        {loading ? (
          <div style={{ padding: 20 }}>Loading insights...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">AI Insights Overview</div>
                <span className="card-badge">Systematic View</span>
              </div>

              {summary && (
                <div className="insight-summary">
                  <div className="summary-item">
                    <div className="summary-label">Revenue</div>
                    <div className="summary-value">{formatMoney(summary.revenue)}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Expenses</div>
                    <div className="summary-value">{formatMoney(summary.expenses)}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Profit Margin</div>
                    <div className="summary-value">{summary.profitMargin.toFixed(1)}%</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Top Category</div>
                    <div className="summary-value">
                      {summary.topCat ? `${summary.topCat.name} (${formatMoney(summary.topCat.value)})` : "�"}
                    </div>
                  </div>
                </div>
              )}

              <Insights data={data?.insights} />
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Monthly Comparison</div>
                <span className="card-badge">Last 4 Months</span>
              </div>
              <div className="compare-table">
                <div className="compare-row head">
                  <span>Month</span>
                  <span>Income</span>
                  <span>Expenses</span>
                  <span>Profit</span>
                  <span>Margin</span>
                </div>
                {comparisonRows.map((row) => (
                  <div className="compare-row" key={row.label}>
                    <span>{row.label}</span>
                    <span>{formatMoney(row.income)}</span>
                    <span>{formatMoney(row.expenses)}</span>
                    <span>{formatMoney(row.profit)}</span>
                    <span>{row.margin.toFixed(1)}%</span>
                  </div>
                ))}
                {!comparisonRows.length && (
                  <div className="compare-empty">No monthly data available.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
