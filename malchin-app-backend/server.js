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
const alerts = require("./routes/alerts");

app.use("/users", users);
app.use("/livestock", livestock);
app.use("/market", market);
app.use("/finance", finance);
app.use("/alerts", alerts);

app.get("/", (req, res) => {
  res.json({ message: "Malchin Super App Backend is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Malchin backend running on port ${PORT}`);
});
