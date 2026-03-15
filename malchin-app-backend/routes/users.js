const express = require("express");
const router = express.Router();
const pool = require("../db");

// Бүх хэрэглэгчид
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Нэг хэрэглэгч авах
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Хэрэглэгч бүртгэх
router.post("/create", async (req, res) => {
  try {
    const { phone, name, role, aimag, sum, bag, lat, lng } = req.body;
    const result = await pool.query(
      `INSERT INTO users (phone, name, role, aimag, sum, bag, lat, lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [phone, name, role || "herder", aimag, sum, bag, lat, lng]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Энэ утасны дугаар бүртгэлтэй байна" });
    }
    res.status(500).json({ error: err.message });
  }
});

// Хэрэглэгч шинэчлэх
router.put("/:id", async (req, res) => {
  try {
    const { name, aimag, sum, bag, lat, lng } = req.body;
    const result = await pool.query(
      `UPDATE users SET name=$1, aimag=$2, sum=$3, bag=$4, lat=$5, lng=$6
       WHERE id=$7 RETURNING *`,
      [name, aimag, sum, bag, lat, lng, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Утасны дугаараар нэвтрэх (энгийн OTP simulation)
router.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Хэрэглэгч олдсонгүй", registered: false });
    }
    res.json({ user: result.rows[0], registered: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
