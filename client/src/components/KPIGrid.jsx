export default function KPIGrid({ data }) {
  const revenue = data?.revenue ?? 0;
  const expenses = data?.expenses ?? 0;
  const profit = data?.profit ?? 0;

  return (
    <div className="kpi-grid">
      <div className="kpi-card" style={{ "--card-accent": "var(--accent)" }}>
        <div className="kpi-label">Total Revenue</div>
        <div className="kpi-value" style={{ color: "var(--accent)" }}>
          ₹{revenue}
        </div>
        <div className="kpi-change up">↑ 12.4% vs last month</div>
        <div className="kpi-icon">◇</div>
      </div>

      <div className="kpi-card" style={{ "--card-accent": "var(--danger)" }}>
        <div className="kpi-label">Total Expenses</div>
        <div className="kpi-value" style={{ color: "var(--danger)" }}>
          ₹{expenses}
        </div>
        <div className="kpi-change down">↑ 8.1% vs last month</div>
        <div className="kpi-icon">↕</div>
      </div>

      <div className="kpi-card" style={{ "--card-accent": "var(--accent2)" }}>
        <div className="kpi-label">Net Profit</div>
        <div className="kpi-value" style={{ color: "var(--accent2)" }}>
          ₹{profit}
        </div>
        <div className="kpi-change up">↑ 18.3% vs last month</div>
        <div className="kpi-icon">◫</div>
      </div>

      
    </div>
  );
}
