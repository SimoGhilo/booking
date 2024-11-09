// api/routes/hotels.js
const express = require('express');
const router = express.Router();
const pool = require('../database.js');

/** GET */

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rates');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:hotel_id', async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM rates WHERE hotel_id = ${req.params.hotel_id}`);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching rates:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



module.exports = router;
