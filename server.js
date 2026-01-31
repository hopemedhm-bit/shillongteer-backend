const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const { clear } = require("console");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// SERVE ADMIN PANEL STATIC FILES
// ===============================
app.use(express.static(path.join(__dirname, "admin")));

// ===============================
// API ROUTES (Existing)
// ===============================
app.use("/auth", require("./routes/authRoutes"));
app.use("/bank", require("./routes/bankRoutes"));
app.use("/limits", require("./routes/limitsRoutes"));
app.use("/bets", require("./routes/betRoutes"));
app.use("/history", require("./routes/historyRoutes"));
app.use("/results", require("./routes/resultsRoutes"));
app.use("/admin", require("./routes/adminRoutes")); // admin login API

// ===============================
// NEW API ROUTES (Secure Time + Status)
// ===============================
app.use("/api/time", require("./routes/timeRoutes"));
app.use("/api/status", require("./routes/statusRoutes"));

// ===============================
// DEFAULT ROUTE
// ===============================
app.get("/", (req, res) => {
    res.send("Teer Result Backend Running");
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
