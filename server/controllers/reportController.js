import PDFDocument from "pdfkit";
import Transaction from "../models/Transaction.js";
import { calculateDashboard } from "../services/dashboardService.js";

const buildRange = (range) => {
  const now = new Date();
  if (range === "monthly") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { start, end, label: "Monthly" };
  }
  if (range === "yearly") {
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    return { start, end, label: "Yearly" };
  }
  return { start: null, end: null, label: "Total" };
};

const formatMoney = (value) =>
  `INR ${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const truncate = (text, max) => {
  const str = String(text || "");
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
};

export const exportReport = async (req, res) => {
  try {
    const range = String(req.query.range || "monthly");
    const { start, end, label } = buildRange(range);

    const query = { userId: req.user.id };
    if (start && end) {
      query.date = { $gte: start, $lt: end };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    const summary = calculateDashboard(transactions);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="finsight-${label.toLowerCase()}-report.pdf"`
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    doc.pipe(res);

    doc.fontSize(18).text("FinSight Report", { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor("#444").text(`${label} Summary`);
    doc
      .fontSize(10)
      .fillColor("#666")
      .text(`Generated: ${formatDate(new Date())}`);
    doc.moveDown();

    doc.fillColor("#111").fontSize(12).text("Key Metrics");
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Total Revenue: ${formatMoney(summary.revenue)}`);
    doc.text(`Total Expenses: ${formatMoney(summary.expenses)}`);
    doc.text(`Net Profit: ${formatMoney(summary.profit)}`);
    doc.moveDown();

    doc.fontSize(12).text("Top Expense Categories");
    doc.moveDown(0.5);
    const topCats = (summary.expenseBreakdown || []).slice(0, 5);
    if (!topCats.length) {
      doc.fontSize(10).fillColor("#666").text("No expense data.");
    } else {
      const catX = 60;
      const amtX = 420;
      doc.fontSize(9).fillColor("#444");
      const catHeaderY = doc.y;
      doc.text("Category", catX, catHeaderY, { width: 300 });
      doc.text("Amount", amtX, catHeaderY, { width: 120, align: "right" });
      doc.moveDown(0.3);
      doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#eee").stroke();
      doc.moveDown(0.4);
      topCats.forEach((c) => {
        const rowY = doc.y;
        doc.fontSize(9).fillColor("#111");
        doc.text(truncate(c.name, 28), catX, rowY, { width: 300 });
        doc.text(formatMoney(c.value), amtX, rowY, {
          width: 120,
          align: "right",
        });
        doc.moveDown(0.4);
      });
    }
    doc.moveDown();

    doc.fontSize(12).text("Recent Transactions");
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor("#444");
    const colX = { date: 40, desc: 130, cat: 330, amt: 450 };
    const colW = { date: 90, desc: 190, cat: 110, amt: 90 };
    const headerY = doc.y;
    doc.text("Date", colX.date, headerY, { width: colW.date });
    doc.text("Description", colX.desc, headerY, { width: colW.desc });
    doc.text("Category", colX.cat, headerY, { width: colW.cat });
    doc.text("Amount", colX.amt, headerY, { width: colW.amt, align: "right" });
    doc.moveDown(0.4);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#ddd").stroke();
    doc.moveDown(0.6);

    const rows = transactions.slice(0, 20);
    if (!rows.length) {
      doc.fontSize(10).fillColor("#666").text("No transactions found.");
    } else {
      const rowHeight = 18;
      rows.forEach((t) => {
        const amount = Number(t.amount || 0);
        const sign = t.type === "expense" ? "-" : "+";
        const rowY = doc.y;
        doc.fontSize(9).fillColor("#111");
        doc.text(formatDate(t.date), colX.date, rowY, {
          width: colW.date,
        });
        doc.text(truncate(t.description || "-", 28), colX.desc, rowY, {
          width: colW.desc,
        });
        doc.text(truncate(t.category || "Misc", 18), colX.cat, rowY, {
          width: colW.cat,
        });
        doc.text(`${sign}${formatMoney(amount)}`, colX.amt, rowY, {
          width: colW.amt,
          align: "right",
        });
        doc.y = rowY + rowHeight;
      });
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Failed to export report" });
  }
};
