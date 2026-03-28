import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const formatMoney = (value) =>
  `INR ${Number(value || 0).toLocaleString("en-IN")}`;

const clampNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const slabLabel = (from, to) =>
  to === Infinity ? `INR ${from}+` : `INR ${from} - INR ${to}`;

const computeSlabs = (taxableIncome, slabs) => {
  const rows = [];
  let remaining = taxableIncome;
  let prev = 0;
  let tax = 0;

  for (const slab of slabs) {
    const upper = slab.upTo;
    const width = upper === Infinity ? remaining : Math.max(0, Math.min(remaining, upper - prev));
    const slabTax = width * slab.rate;
    rows.push({
      range: slabLabel(prev + 1, upper),
      amount: width,
      rate: slab.rate,
      tax: slabTax,
    });
    tax += slabTax;
    remaining -= width;
    prev = upper;
    if (remaining <= 0) break;
  }

  return { rows, tax };
};

const getSlabs = (regime, ageGroup) => {
  if (regime === "new") {
    return [
      { upTo: 300000, rate: 0 },
      { upTo: 700000, rate: 0.05 },
      { upTo: 1000000, rate: 0.1 },
      { upTo: 1200000, rate: 0.15 },
      { upTo: 1500000, rate: 0.2 },
      { upTo: Infinity, rate: 0.3 },
    ];
  }

  if (ageGroup === "senior") {
    return [
      { upTo: 300000, rate: 0 },
      { upTo: 500000, rate: 0.05 },
      { upTo: 1000000, rate: 0.2 },
      { upTo: Infinity, rate: 0.3 },
    ];
  }

  if (ageGroup === "super") {
    return [
      { upTo: 500000, rate: 0 },
      { upTo: 1000000, rate: 0.2 },
      { upTo: Infinity, rate: 0.3 },
    ];
  }

  return [
    { upTo: 250000, rate: 0 },
    { upTo: 500000, rate: 0.05 },
    { upTo: 1000000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 },
  ];
};

const getSurchargeRate = (income, regime) => {
  if (income <= 5000000) return 0;
  if (income <= 10000000) return 0.1;
  if (income <= 20000000) return 0.15;
  if (income <= 50000000) return 0.25;
  if (regime === "new") return 0.25;
  return 0.37;
};

export default function TaxSummaryPage({ onLogout, user, onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regime, setRegime] = useState("new");
  const [ageGroup, setAgeGroup] = useState("below");
  const [otherIncome, setOtherIncome] = useState(0);
  const [deductions, setDeductions] = useState(0);

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/dashboard")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tax summary:", err);
        if (err?.response?.status === 401 && onLogout) {
          onLogout();
          return;
        }
        setLoading(false);
      });
  }, [onLogout]);

  const calc = useMemo(() => {
    if (!data) return null;
    const businessProfit = Math.max(0, clampNumber(data.profit));
    const other = Math.max(0, clampNumber(otherIncome));
    const deductionsAllowed = regime === "old" ? Math.max(0, clampNumber(deductions)) : 0;
    const taxableIncome = Math.max(0, businessProfit + other - deductionsAllowed);

    const slabs = getSlabs(regime, ageGroup);
    const { rows, tax } = computeSlabs(taxableIncome, slabs);

    const surchargeRate = getSurchargeRate(taxableIncome, regime);
    const surcharge = tax * surchargeRate;
    const cess = 0.04 * (tax + surcharge);
    const total = tax + surcharge + cess;

    return {
      businessProfit,
      other,
      deductionsAllowed,
      taxableIncome,
      rows,
      tax,
      surchargeRate,
      surcharge,
      cess,
      total,
    };
  }, [data, regime, ageGroup, otherIncome, deductions]);

  return (
    <div className="layout">
      <Sidebar
        userName={user?.businessName || user?.name}
        onLogout={onLogout}
        activeView="tax"
        onNavigate={onNavigate}
      />

      <main className="main">
        <Topbar onLogout={onLogout} userName={user?.name} />

        {loading ? (
          <div style={{ padding: 20 }}>Loading tax summary...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Tax Summary (India)</div>
                <span className="card-badge">AY 2025-26</span>
              </div>

              <div className="tax-controls">
                <div className="tax-control">
                  <div className="tax-label">Tax Regime</div>
                  <select
                    className="form-select"
                    value={regime}
                    onChange={(e) => setRegime(e.target.value)}
                  >
                    <option value="new">New Regime (Default)</option>
                    <option value="old">Old Regime</option>
                  </select>
                </div>
                <div className="tax-control">
                  <div className="tax-label">Age</div>
                  <select
                    className="form-select"
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                  >
                    <option value="below">Below 60</option>
                    <option value="senior">60 to 80</option>
                    <option value="super">80 and above</option>
                  </select>
                </div>
                <div className="tax-control">
                  <div className="tax-label">Other Income</div>
                  <input
                    className="form-input"
                    type="number"
                    value={otherIncome}
                    onChange={(e) => setOtherIncome(e.target.value)}
                  />
                </div>
                <div className="tax-control">
                  <div className="tax-label">Deductions (Old)</div>
                  <input
                    className="form-input"
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    disabled={regime !== "old"}
                  />
                </div>
              </div>

              {calc && (
                <div className="tax-summary">
                  <div className="tax-item">
                    <div className="tax-name">Business Profit</div>
                    <div className="tax-value">{formatMoney(calc.businessProfit)}</div>
                  </div>
                  <div className="tax-item">
                    <div className="tax-name">Taxable Income</div>
                    <div className="tax-value">{formatMoney(calc.taxableIncome)}</div>
                  </div>
                  <div className="tax-item">
                    <div className="tax-name">Base Tax</div>
                    <div className="tax-value">{formatMoney(calc.tax)}</div>
                  </div>
                  <div className="tax-item">
                    <div className="tax-name">Surcharge</div>
                    <div className="tax-value">
                      {calc.surchargeRate > 0
                        ? `${formatMoney(calc.surcharge)} (${(calc.surchargeRate * 100).toFixed(0)}%)`
                        : "�"}
                    </div>
                  </div>
                  <div className="tax-item">
                    <div className="tax-name">Cess (4%)</div>
                    <div className="tax-value">{formatMoney(calc.cess)}</div>
                  </div>
                  <div className="tax-item total">
                    <div className="tax-name">Total Tax</div>
                    <div className="tax-value">{formatMoney(calc.total)}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Slab-wise Calculation</div>
                <span className="card-badge">Detailed Breakdown</span>
              </div>
              <div className="compare-table">
                <div className="compare-row head">
                  <span>Slab</span>
                  <span>Taxable</span>
                  <span>Rate</span>
                  <span>Tax</span>
                  <span></span>
                </div>
                {calc?.rows?.map((row, idx) => (
                  <div className="compare-row" key={`${row.range}-${idx}`}>
                    <span>{row.range}</span>
                    <span>{formatMoney(row.amount)}</span>
                    <span>{(row.rate * 100).toFixed(0)}%</span>
                    <span>{formatMoney(row.tax)}</span>
                    <span></span>
                  </div>
                ))}
              </div>
              <div className="tax-note">
                New regime is default for business/profession. To opt old regime, Form 10-IEA is required.
                Surcharge/cess as per slabs; marginal relief not included.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
