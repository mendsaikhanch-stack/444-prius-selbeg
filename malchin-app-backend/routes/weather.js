const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_API_KEY || "";

// Монголын аймгуудын координат
const AIMAG_COORDS = {
  Arkhangai: { lat: 47.8611, lon: 100.7236, name: "Архангай" },
  Bayankhongor: { lat: 46.1947, lon: 100.7181, name: "Баянхонгор" },
  Bulgan: { lat: 48.8125, lon: 103.5347, name: "Булган" },
  Dornod: { lat: 47.3170, lon: 115.7903, name: "Дорнод" },
  Dundgobi: { lat: 45.7625, lon: 106.2644, name: "Дундговь" },
  Gobi_Altai: { lat: 46.3725, lon: 96.2583, name: "Говь-Алтай" },
  Khentii: { lat: 47.3178, lon: 109.6513, name: "Хэнтий" },
  Khovd: { lat: 48.0056, lon: 91.6428, name: "Ховд" },
  Khuvsgul: { lat: 49.3892, lon: 99.7250, name: "Хөвсгөл" },
  Umnugobi: { lat: 43.5711, lon: 104.4250, name: "Өмнөговь" },
  Selenge: { lat: 49.8900, lon: 106.1847, name: "Сэлэнгэ" },
  Sukhbaatar: { lat: 46.6922, lon: 113.3858, name: "Сүхбаатар" },
  Tuv: { lat: 47.7131, lon: 106.9528, name: "Төв" },
  Uvs: { lat: 49.9847, lon: 92.0669, name: "Увс" },
  Zavkhan: { lat: 48.2608, lon: 96.0703, name: "Завхан" },
  Ulaanbaatar: { lat: 47.9214, lon: 106.9055, name: "Улаанбаатар" },
};

// Демо data (API key байхгүй үед)
const demoData = {
  Arkhangai: { temp: -5, feels_like: -10, wind: 3, humidity: 65, condition: "Clear", description: "Цэлмэг", snow: 0, dzud_risk: "low", forecast: [{ day: 1, temp_day: -3, temp_night: -12, condition: "Cloudy" }, { day: 2, temp_day: -8, temp_night: -18, condition: "Snow" }, { day: 3, temp_day: -12, temp_night: -22, condition: "Storm" }, { day: 4, temp_day: -7, temp_night: -15, condition: "Clear" }, { day: 5, temp_day: -4, temp_night: -13, condition: "Clear" }, { day: 6, temp_day: -2, temp_night: -10, condition: "Cloudy" }, { day: 7, temp_day: -5, temp_night: -14, condition: "Clear" }] },
  Khuvsgul: { temp: -15, feels_like: -22, wind: 5, humidity: 75, condition: "Snow", description: "Цас", snow: 20, dzud_risk: "high", forecast: [{ day: 1, temp_day: -18, temp_night: -28, condition: "Snow" }, { day: 2, temp_day: -20, temp_night: -30, condition: "Storm" }, { day: 3, temp_day: -16, temp_night: -25, condition: "Cloudy" }, { day: 4, temp_day: -12, temp_night: -22, condition: "Clear" }, { day: 5, temp_day: -10, temp_night: -20, condition: "Clear" }, { day: 6, temp_day: -14, temp_night: -24, condition: "Snow" }, { day: 7, temp_day: -11, temp_night: -21, condition: "Cloudy" }] },
  Umnugobi: { temp: 2, feels_like: -3, wind: 8, humidity: 25, condition: "Windy", description: "Салхитай", snow: 0, dzud_risk: "medium", forecast: [{ day: 1, temp_day: 0, temp_night: -10, condition: "Windy" }, { day: 2, temp_day: -3, temp_night: -12, condition: "Dust" }, { day: 3, temp_day: 1, temp_night: -8, condition: "Clear" }, { day: 4, temp_day: 4, temp_night: -6, condition: "Clear" }, { day: 5, temp_day: 2, temp_night: -9, condition: "Windy" }, { day: 6, temp_day: -1, temp_night: -11, condition: "Cloudy" }, { day: 7, temp_day: 3, temp_night: -7, condition: "Clear" }] },
  Tuv: { temp: -3, feels_like: -7, wind: 2, humidity: 55, condition: "Cloudy", description: "Үүлэрхэг", snow: 5, dzud_risk: "low", forecast: [{ day: 1, temp_day: -2, temp_night: -11, condition: "Cloudy" }, { day: 2, temp_day: -5, temp_night: -14, condition: "Snow" }, { day: 3, temp_day: -1, temp_night: -10, condition: "Clear" }, { day: 4, temp_day: 0, temp_night: -9, condition: "Clear" }, { day: 5, temp_day: -3, temp_night: -12, condition: "Cloudy" }, { day: 6, temp_day: -4, temp_night: -13, condition: "Snow" }, { day: 7, temp_day: -2, temp_night: -11, condition: "Clear" }] },
};

// Зудын эрсдэлийн тооцоо
function calcDzudRisk(temp, wind, snow) {
  let score = 0;
  if (temp < -30) score += 4;
  else if (temp < -20) score += 3;
  else if (temp < -10) score += 2;
  else if (temp < 0) score += 1;

  if (wind > 15) score += 3;
  else if (wind > 10) score += 2;
  else if (wind > 5) score += 1;

  if (snow > 30) score += 3;
  else if (snow > 15) score += 2;
  else if (snow > 5) score += 1;

  if (score >= 8) return "very_high";
  if (score >= 6) return "high";
  if (score >= 4) return "medium";
  return "low";
}

// One Call API 3.0 ашиглан бодит цаг агаар авах
async function fetchRealWeather(aimag) {
  const coords = AIMAG_COORDS[aimag];
  if (!coords || !API_KEY) return null;

  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=minutely,hourly&appid=${API_KEY}&units=metric&lang=mn`
    );

    const d = res.data;
    const current = d.current;
    const snow = current.snow ? current.snow["1h"] || 0 : 0;

    return {
      aimag,
      name: coords.name,
      temp: Math.round(current.temp),
      feels_like: Math.round(current.feels_like),
      wind: current.wind_speed,
      humidity: current.humidity,
      condition: current.weather[0].main,
      description: current.weather[0].description,
      uvi: current.uvi,
      snow,
      dzud_risk: calcDzudRisk(current.temp, current.wind_speed, snow),
      source: "openweathermap_3.0",
      forecast: d.daily.slice(0, 7).map((day, i) => ({
        day: i + 1,
        temp_day: Math.round(day.temp.day),
        temp_night: Math.round(day.temp.night),
        temp_min: Math.round(day.temp.min),
        temp_max: Math.round(day.temp.max),
        wind: day.wind_speed,
        humidity: day.humidity,
        condition: day.weather[0].main,
        description: day.weather[0].description,
        dzud_risk: calcDzudRisk(day.temp.min, day.wind_speed, day.snow || 0),
      })),
      alerts: d.alerts
        ? d.alerts.map((a) => ({
            event: a.event,
            description: a.description,
            start: new Date(a.start * 1000),
            end: new Date(a.end * 1000),
          }))
        : [],
    };
  } catch (err) {
    console.error("Weather API error:", err.response?.data?.message || err.message);
    return null;
  }
}

// Аймгийн цаг агаар
router.get("/:aimag", async (req, res) => {
  const aimag = req.params.aimag;

  if (API_KEY) {
    const real = await fetchRealWeather(aimag);
    if (real) return res.json(real);
  }

  const data = demoData[aimag] || demoData.Tuv;
  res.json({ aimag, source: "demo", ...data });
});

// Бүх аймгийн товч мэдээ
router.get("/", async (req, res) => {
  if (API_KEY) {
    try {
      const results = await Promise.all(
        Object.keys(AIMAG_COORDS).slice(0, 8).map(async (aimag) => {
          const data = await fetchRealWeather(aimag);
          if (data) {
            return { aimag, name: data.name, temp: data.temp, condition: data.condition, dzud_risk: data.dzud_risk, source: "openweathermap_3.0" };
          }
          return { aimag, source: "demo", ...(demoData[aimag] || demoData.Tuv) };
        })
      );
      return res.json(results);
    } catch (err) {
      // fallback to demo
    }
  }

  res.json(
    Object.keys(demoData).map((k) => ({
      aimag: k,
      temp: demoData[k].temp,
      condition: demoData[k].condition,
      dzud_risk: demoData[k].dzud_risk,
      source: "demo",
    }))
  );
});

module.exports = router;
