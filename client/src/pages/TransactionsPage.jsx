import { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Modal from "../components/Modal";

const formatAmount = (amount, isCredit) =>
  `${isCredit ? "+" : "-"}INR ${Number(amount || 0).toLocaleString("en-IN")}`;

const iconLetter = (t) => {
  const base =
    t?.description ||
    t?.category ||
    (t?.type === "income" ? "Income" : "Expense") ||
    "Transaction";
  return String(base).trim().charAt(0).toUpperCase() || "T";
};

export default function TransactionsPage({ onLogout, user, onNavigate }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTransactions = () => {
    setLoading(true);
    api
      .get("/api/transactions")
      .then((res) => {
        setTransactions(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        if (err?.response?.status === 401 && onLogout) {
          onLogout();
          return;
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const deleteTransaction = async (tx) => {
    if (!tx?._id) return;
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/api/transactions/${tx._id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete transaction.");
    }
  };

  return (
    <div className="layout">
      <Sidebar
        userName={user?.businessName || user?.name}
        onLogout={onLogout}
        activeView="transactions"
        onNavigate={onNavigate}
      />

      <main className="main">
        <Topbar onAdd={() => setShowModal(true)} onLogout={onLogout} userName={user?.name} />

        <div className="card">
          <div className="card-header">
            <div className="card-title">All Transactions</div>
            <div className="card-actions">
              <span className="card-badge">Auto-Categorized</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(true)}>
                + Add
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 12 }}>Loading transactions...</div>
          ) : (
            <div className="tx-list">
              {transactions.map((t) => {
                const isCredit = t.type === "credit" || t.type === "income";
                const amount = t.amount ?? 0;
                return (
                  <div className="tx-item" key={t._id}>
                    <div
                      className="tx-icon"
                      style={{
                        background: "rgba(0,212,170,0.1)",
                        color: isCredit ? "var(--accent)" : "var(--danger)",
                      }}
                    >
                      {iconLetter(t)}
                    </div>
                    <div className="tx-info">
                      <div className="tx-name">{t.description || "Transaction"}</div>
                      <div className="tx-meta">
                        {t.date || "Today"} -{" "}
                        <span
                          style={{
                            color: isCredit ? "var(--accent)" : "var(--danger)",
                          }}
                        >
                          {t.category || (isCredit ? "Income" : "Expense")}
                        </span>
                      </div>
                    </div>
                    <div className={`tx-amount ${isCredit ? "credit" : "debit"}`}>
                      {formatAmount(amount, isCredit)}
                    </div>
                    <button
                      className="tx-delete"
                      onClick={() => deleteTransaction(t)}
                      title="Delete transaction"
                    >
                      X
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchTransactions();
          }}
        />
      )}
    </div>
  );
}
