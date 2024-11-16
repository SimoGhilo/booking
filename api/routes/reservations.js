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

  /** POST */

  router.post('/book', async (req,res) => {
    try {
      let user_id = req.body.user_id;
      let hotel_id = req.body.hotel_id;
      let rate_id = req.body.rate_id;
      let start_date = req.body.start_date;
      let end_date = req.body.end_date;

      const query = `
      INSERT INTO \`booking\`.\`reservations\` (
        \`user_id\`,
        \`hotel_id\`,
        \`rate_id\`,
        \`start_date\`,
        \`end_date\`
      )
      VALUES (?, ?, ?, ?, ?);
    `;
    
    const values = [user_id, hotel_id, rate_id, start_date, end_date];
    
    const [result] = await pool.query(query, values)

    res.json({
      success: true,
      message: 'Reservation successfully created',
      result: result
    });
      
    } catch (error) {
      console.error('Error posting reservations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



module.exports = router;