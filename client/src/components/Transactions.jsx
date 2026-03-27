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

export default function Transactions({ data = [], onAdd, onDelete }) {
  if (!data.length) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Transactions</div>
          <div className="card-actions">
            <span className="card-badge">Auto-Categorized</span>
            <button className="btn btn-ghost btn-sm" onClick={onAdd}>
              + Add
            </button>
          </div>
        </div>
        <div className="tx-list">
          <div className="tx-item">
            <div
              className="tx-icon"
              style={{ background: "rgba(0,212,170,0.1)", color: "var(--accent)" }}
            >
              C
            </div>
            <div className="tx-info">
              <div className="tx-name">Client Payment - Mehta Traders</div>
              <div className="tx-meta">
                Mar 25, 2026 -{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                  Income
                </span>
              </div>
            </div>
            <div className="tx-amount credit">+INR 45,000</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Recent Transactions</div>
        <div className="card-actions">
          <span className="card-badge">Auto-Categorized</span>
          <button className="btn btn-ghost btn-sm" onClick={onAdd}>
            + Add
          </button>
        </div>
      </div>

      <div className="tx-list">
        {data.map((t, i) => {
          const isCredit = t.type === "credit" || t.type === "income";
          const amount = t.amount ?? 0;
          return (
            <div className="tx-item" key={t._id || i}>
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
                onClick={() => onDelete && onDelete(t)}
                title="Delete transaction"
              >
                X
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
