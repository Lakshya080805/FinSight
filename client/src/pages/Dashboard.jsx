import { useState, useEffect, useCallback } from "react";
import api from "../api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import KPIGrid from "../components/KPIGrid";
import Transactions from "../components/Transactions";
import Insights from "../components/Insights";
import HealthScore from "../components/HealthScore";
import Modal from "../components/Modal";
import CashFlowChart from "../components/CashFlowChart";
import ExpensePie from "../components/ExpensePie";
import MonthlyTrends from "../components/MonthlyTrends";

export default function Dashboard({ onLogout, user, onNavigate }) {
  const [showModal, setShowModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(() => {
    setLoading(true);
    api
      .get("/api/dashboard")
      .then((res) => {
        setDashboardData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard:", err);
        if (err?.response?.status === 401 && onLogout) {
          onLogout();
          return;
        }
        setLoading(false);
      });
  }, [onLogout]);

  const deleteTransaction = async (tx) => {
    if (!tx?._id) return;
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/api/transactions/${tx._id}`);
      fetchDashboard();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete transaction.");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="layout">
      <Sidebar
        userName={user?.businessName || user?.name}
        onLogout={onLogout}
        activeView="dashboard"
        onNavigate={onNavigate}
      />

      <main className="main">
        <Topbar
          onAdd={() => setShowModal(true)}
          onLogout={onLogout}
          userName={user?.name}
        />

        <div className="alert-banner">
          <div className="alert-dot"></div>
          <div className="alert-text">
            <strong>⚠ Unusual Spending:</strong> Software costs are high.
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "20px" }}>Loading dashboard...</div>
        ) : (
          <>
            <KPIGrid data={dashboardData} />

            <div className="content-grid">
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Transactions
                  data={dashboardData?.transactions}
                  onAdd={() => setShowModal(true)}
                  onDelete={deleteTransaction}
                />
                <MonthlyTrends data={dashboardData?.monthlyTrends} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Insights data={dashboardData?.insights} />
                <HealthScore data={dashboardData?.health} />
                <ExpensePie data={dashboardData?.expenseBreakdown} />
                <CashFlowChart data={dashboardData?.cashFlowSeries} />
              </div>
            </div>
          </>
        )}
      </main>

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchDashboard();
          }}
        />
      )}
    </div>
  );
}
