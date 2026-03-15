const express = require("express");
const router = express.Router();
const pool = require("../db");

// Малчны бүх малын бүртгэл
router.get("/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM livestock WHERE user_id = $1 ORDER BY animal_type",
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Мал нэмэх / тоо бүртгэх
router.post("/add", async (req, res) => {
  try {
    const { user_id, animal_type, total_count } = req.body;

    // Хэрэв аль хэдийн бүртгэлтэй бол тоог шинэчлэх
    const existing = await pool.query(
      "SELECT * FROM livestock WHERE user_id = $1 AND animal_type = $2",
      [user_id, animal_type]
    );

    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE livestock SET total_count = $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND animal_type = $3 RETURNING *`,
        [total_count, user_id, animal_type]
      );
    } else {
      result = await pool.query(
        "INSERT INTO livestock (user_id, animal_type, total_count) VALUES ($1, $2, $3) RETURNING *",
        [user_id, animal_type, total_count]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Малын үйл явдал бүртгэх (төл, хорогдол, зарсан г.м.)
router.post("/event", async (req, res) => {
  try {
    const { user_id, animal_type, event_type, quantity, note, event_date } = req.body;

    // Үйл явдал бүртгэх
    const event = await pool.query(
      `INSERT INTO livestock_events (user_id, animal_type, event_type, quantity, note, event_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, animal_type, event_type, quantity, note, event_date || new Date()]
    );

    // Малын тоог автоматаар шинэчлэх
    const livestock = await pool.query(
      "SELECT * FROM livestock WHERE user_id = $1 AND animal_type = $2",
      [user_id, animal_type]
    );

    if (livestock.rows.length > 0) {
      let newCount = livestock.rows[0].total_count;
      if (event_type === "birth" || event_type === "purchased") {
        newCount += quantity;
      } else if (event_type === "death" || event_type === "sold") {
        newCount = Math.max(0, newCount - quantity);
      }

      await pool.query(
        "UPDATE livestock SET total_count = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND animal_type = $3",
        [newCount, user_id, animal_type]
      );
    }

    res.status(201).json(event.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Малын үйл явдлын түүх
router.get("/events/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM livestock_events WHERE user_id = $1 ORDER BY event_date DESC",
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Малын статистик (нийт тоо, төрлөөр)
router.get("/stats/:user_id", async (req, res) => {
  try {
    const totals = await pool.query(
      "SELECT animal_type, total_count FROM livestock WHERE user_id = $1",
      [req.params.user_id]
    );

    const events = await pool.query(
      `SELECT animal_type, event_type, SUM(quantity) as total
       FROM livestock_events WHERE user_id = $1
       GROUP BY animal_type, event_type`,
      [req.params.user_id]
    );

    const totalAll = totals.rows.reduce((sum, r) => sum + r.total_count, 0);

    res.json({
      livestock: totals.rows,
      events_summary: events.rows,
      total_animals: totalAll,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
