const express = require("express");
const router = express.Router();
const pool = require("../db");

// Бүх зар авах (шүүлтүүртэй)
router.get("/", async (req, res) => {
  try {
    const { category, animal_type, location } = req.query;
    let query = "SELECT m.*, u.name as seller_name, u.phone as seller_phone FROM market_listings m JOIN users u ON m.user_id = u.id WHERE m.status = 'active'";
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND m.category = $${params.length}`;
    }
    if (animal_type) {
      params.push(animal_type);
      query += ` AND m.animal_type = $${params.length}`;
    }
    if (location) {
      params.push(`%${location}%`);
      query += ` AND m.location ILIKE $${params.length}`;
    }

    query += " ORDER BY m.created_at DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Нэг зар харах
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, u.name as seller_name, u.phone as seller_phone, u.aimag, u.sum
       FROM market_listings m JOIN users u ON m.user_id = u.id WHERE m.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Зар олдсонгүй" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Зар нэмэх
router.post("/create", async (req, res) => {
  try {
    const { user_id, category, title, description, animal_type, quantity, price, location } = req.body;
    const result = await pool.query(
      `INSERT INTO market_listings (user_id, category, title, description, animal_type, quantity, price, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [user_id, category || "livestock", title, description, animal_type, quantity, price, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Зарын статус өөрчлөх
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      "UPDATE market_listings SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Хэрэглэгчийн зарууд
router.get("/user/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM market_listings WHERE user_id = $1 ORDER BY created_at DESC",
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
