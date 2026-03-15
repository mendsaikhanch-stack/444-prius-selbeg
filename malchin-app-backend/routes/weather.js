const express = require("express");
const router = express.Router();

const weatherData = {
  Arkhangai: {
    temp: -5, wind: 3, condition: "Clear", snow: 0, dzud_risk: "low",
    forecast: [
      { day: 1, temp: -3, condition: "Cloudy" },
      { day: 2, temp: -8, condition: "Snow" },
      { day: 3, temp: -12, condition: "Storm" },
      { day: 4, temp: -7, condition: "Clear" },
      { day: 5, temp: -4, condition: "Clear" },
      { day: 6, temp: -2, condition: "Cloudy" },
      { day: 7, temp: -5, condition: "Clear" },
    ],
  },
  Khuvsgul: {
    temp: -15, wind: 5, condition: "Snow", snow: 20, dzud_risk: "high",
    forecast: [
      { day: 1, temp: -18, condition: "Snow" },
      { day: 2, temp: -20, condition: "Storm" },
      { day: 3, temp: -16, condition: "Cloudy" },
      { day: 4, temp: -12, condition: "Clear" },
      { day: 5, temp: -10, condition: "Clear" },
      { day: 6, temp: -14, condition: "Snow" },
      { day: 7, temp: -11, condition: "Cloudy" },
    ],
  },
  Umnugobi: {
    temp: 2, wind: 8, condition: "Windy", snow: 0, dzud_risk: "medium",
    forecast: [
      { day: 1, temp: 0, condition: "Windy" },
      { day: 2, temp: -3, condition: "Dust" },
      { day: 3, temp: 1, condition: "Clear" },
      { day: 4, temp: 4, condition: "Clear" },
      { day: 5, temp: 2, condition: "Windy" },
      { day: 6, temp: -1, condition: "Cloudy" },
      { day: 7, temp: 3, condition: "Clear" },
    ],
  },
  Tuv: {
    temp: -3, wind: 2, condition: "Cloudy", snow: 5, dzud_risk: "low",
    forecast: [
      { day: 1, temp: -2, condition: "Cloudy" },
      { day: 2, temp: -5, condition: "Snow" },
      { day: 3, temp: -1, condition: "Clear" },
      { day: 4, temp: 0, condition: "Clear" },
      { day: 5, temp: -3, condition: "Cloudy" },
      { day: 6, temp: -4, condition: "Snow" },
      { day: 7, temp: -2, condition: "Clear" },
    ],
  },
};

// Аймгийн цаг агаар
router.get("/:aimag", (req, res) => {
  const data = weatherData[req.params.aimag] || weatherData.Tuv;
  res.json({ aimag: req.params.aimag, ...data });
});

// Бүх аймгийн товч мэдээ
router.get("/", (req, res) => {
  res.json(
    Object.keys(weatherData).map((k) => ({
      aimag: k,
      temp: weatherData[k].temp,
      condition: weatherData[k].condition,
      dzud_risk: weatherData[k].dzud_risk,
    }))
  );
});

module.exports = router;
