const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const users = require("./routes/users");
const livestock = require("./routes/livestock");
const market = require("./routes/market");
const finance = require("./routes/finance");
const weather = require("./routes/weather");
const ai = require("./routes/ai");
const alerts = require("./routes/alerts");

app.use("/users", users);
app.use("/livestock", livestock);
app.use("/market", market);
app.use("/finance", finance);
app.use("/weather", weather);
app.use("/ai", ai);
app.use("/alerts", alerts);

// Serve dashboard
const path = require("path");
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.get("/", (req, res) => {
  res.json({
    message: "Malchin Super App Backend",
    version: "1.0",
    endpoints: ["/users", "/livestock", "/market", "/finance", "/weather", "/ai", "/alerts", "/dashboard"],
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Malchin backend running on port ${PORT}`);
});
