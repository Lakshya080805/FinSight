// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// import transactionRoutes from "./routes/transactionRoutes.js";
// import dashboardRoutes from "./routes/dashboardRoutes.js";
// import insightRoutes from "./routes/insightRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import aiRoutes from "./routes/aiRoutes.js";
// import reportRoutes from "./routes/reportRoutes.js";

// dotenv.config();
// connectDB();

// const cors = require("cors");

// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true
// }));

// const app = express();

// const groqKey = process.env.GROQ_API_KEY || "";
// console.log(
//   `Groq key loaded: ${groqKey ? `yes (length ${groqKey.length})` : "no"}`
// );

// app.use(cors());
// app.use(express.json());

// app.use("/api/transactions", transactionRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/insights", insightRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/reports", reportRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import insightRoutes from "./routes/insightRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();
connectDB();

const app = express(); // ✅ define FIRST

// ✅ CORS config (only once)
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

const groqKey = process.env.GROQ_API_KEY || "";
console.log(
  `Groq key loaded: ${groqKey ? `yes (length ${groqKey.length})` : "no"}`
);

// routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
