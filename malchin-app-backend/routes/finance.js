const express = require("express");
const router = express.Router();
const pool = require("../db");

// Санхүүгийн бүртгэл авах
router.get("/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM finance_records WHERE user_id = $1 ORDER BY record_date DESC",
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Орлого/зардал нэмэх
router.post("/add", async (req, res) => {
  try {
    const { user_id, type, category, amount, note, record_date } = req.body;
    const result = await pool.query(
      `INSERT INTO finance_records (user_id, type, category, amount, note, record_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, type, category, amount, note, record_date || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Санхүүгийн тойм (орлого, зардал, ашиг)
router.get("/summary/:user_id", async (req, res) => {
  try {
    const { year } = req.query;
    let dateFilter = "";
    const params = [req.params.user_id];

    if (year) {
      params.push(year);
      dateFilter = ` AND EXTRACT(YEAR FROM record_date) = $${params.length}`;
    }

    const income = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total_income,
              category, SUM(amount) as category_total
       FROM finance_records
       WHERE user_id = $1 AND type = 'income'${dateFilter}
       GROUP BY category`,
      params
    );

    const expense = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total_expense,
              category, SUM(amount) as category_total
       FROM finance_records
       WHERE user_id = $1 AND type = 'expense'${dateFilter}
       GROUP BY category`,
      params
    );

    const totalIncome = income.rows.reduce((sum, r) => sum + parseInt(r.category_total), 0);
    const totalExpense = expense.rows.reduce((sum, r) => sum + parseInt(r.category_total), 0);

    res.json({
      total_income: totalIncome,
      total_expense: totalExpense,
      profit: totalIncome - totalExpense,
      income_by_category: income.rows,
      expense_by_category: expense.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Сарын санхүүгийн тайлан
router.get("/monthly/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         EXTRACT(YEAR FROM record_date) as year,
         EXTRACT(MONTH FROM record_date) as month,
         type,
         SUM(amount) as total
       FROM finance_records
       WHERE user_id = $1
       GROUP BY year, month, type
       ORDER BY year DESC, month DESC`,
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
