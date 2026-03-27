import Transaction from "../models/Transaction.js";
import detectAnomaly from "../services/anomalyService.js";
import { categorizeDescription } from "../services/aiAssistant.js";

const normalizeCategory = (category) => {
  if (!category) return null;
  if (category === "Auto-Detect (AI)") return null;
  if (category === "Sales Income") return "Sales";
  if (category === "Other") return "Misc";
  return category;
};

export const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const normalizedAmount = Number(amount || 0);
    const isAnomaly = await detectAnomaly(req.user.id, normalizedAmount);

    let finalCategory = normalizeCategory(category);
    if (!finalCategory || finalCategory === "Auto-Detect (AI)") {
      finalCategory = await categorizeDescription(description);
    }

    const tx = await Transaction.create({
      userId: req.user.id,
      type,
      amount: normalizedAmount,
      category: finalCategory,
      description,
      date: date ? new Date(date) : new Date(),
      isAnomaly,
    });

    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(transactions);
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
