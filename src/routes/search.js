const express = require("express");
const db = require("../db");

const router = express.Router();

// [BUG – OWASP A03:2021 Injection / SQL injection]
// User input from the query string is concatenated straight into SQL.
// Fix: use a parameterised query, e.g. db.query("... LIKE ?", [`%${term}%`]).
router.get("/search", async (req, res) => {
  const term = req.query.q;
  const sql = "SELECT id, name, price FROM products WHERE name LIKE '%" + term + "%'";
  const result = await db.query(sql);
  res.json(result.rows);
});

module.exports = router;
