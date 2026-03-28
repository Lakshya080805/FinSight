import Transaction from "../models/Transaction.js";
import { generateChatResponse } from "../services/aiAssistant.js";

export const chatWithAI = async (req, res) => {
  try {
    const { query } = req.body;
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      date: -1,
    });
    const reply = await generateChatResponse(query, transactions);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: "AI service error" });
  }
};
 