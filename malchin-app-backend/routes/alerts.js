const express = require("express");
const router = express.Router();
const pool = require("../db");

// Бүх аюулын мэдэгдэл (бүс нутгаар шүүх)
router.get("/", async (req, res) => {
  try {
    const { region, type, severity } = req.query;
    let query = "SELECT a.*, u.name as reporter_name FROM alerts a LEFT JOIN users u ON a.user_id = u.id WHERE 1=1";
    const params = [];

    if (region) {
      params.push(`%${region}%`);
      query += ` AND a.region ILIKE $${params.length}`;
    }
    if (type) {
      params.push(type);
      query += ` AND a.type = $${params.length}`;
    }
    if (severity) {
      params.push(severity);
      query += ` AND a.severity = $${params.length}`;
    }

    query += " ORDER BY a.created_at DESC LIMIT 50";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Аюулын мэдэгдэл нэмэх
router.post("/create", async (req, res) => {
  try {
    const { user_id, region, type, title, description, severity, lat, lng } = req.body;
    const result = await pool.query(
      `INSERT INTO alerts (user_id, region, type, title, description, severity, lat, lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [user_id, region, type, title, description, severity || "yellow", lat, lng]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
