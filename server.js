const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const fcmRoutes = require("./routes/fcmRoutes");


// ===============================
// LOAD ENV VARIABLES
// ===============================
dotenv.config();

// ===============================
// INIT FIREBASE (loads firebase.js)
// ===============================
require("./firebase");

// ===============================
// CONNECT DATABASE
// ===============================
connectDB();

// ===============================
// INIT EXPRESS APP
// ===============================
const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// API ROUTES
// ===============================
app.use("/auth", require("./routes/authRoutes"));
app.use("/bank", require("./routes/bankRoutes"));
app.use("/limits", require("./routes/limitsRoutes"));
app.use("/bets", require("./routes/betRoutes"));
app.use("/history", require("./routes/historyRoutes"));
app.use("/results", require("./routes/resultsRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));

// ⭐ TIME + STATUS
app.use("/", require("./routes/statusRoutes"));


app.use("/fcm", fcmRoutes);


// ===============================
// SERVE ADMIN PANEL STATIC FILES
// ===============================
app.use(express.static(path.join(__dirname, "admin")));

// ===============================
// DEFAULT ROUTE
// ===============================
app.get("/", (req, res) => {
    res.send("Teer Result Backend Running 🚀");
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
