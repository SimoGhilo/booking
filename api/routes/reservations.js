// api/routes/hotels.js
const express = require('express');
const router = express.Router();
const pool = require('../database.js');

/** GET */

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reservations');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:user_id', async (req, res) => {
    try {
      const [rows] = await pool.query(` SELECT r.*, c.name, h.src, h.name AS hotelName FROM booking.reservations r 
 JOIN hotels h ON h.id = r.hotel_id
 JOIN cities c ON c.id = r.id WHERE user_id = ${req.params.user_id}`);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



module.exports = router;