// api/routes/cities.js
const express = require('express');
const router = express.Router();
const pool = require('../database.js');


router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM feedback');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  /**POST */

  router.post('/new', async (req,res) => {
    try {
      let user_id = req.body.user_id;
      let hotel_id = req.body.hotel_id;
      let rating = req.body.rating;
      let comment = req.body.comment;
      let created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');


      const query = `
      INSERT INTO \`booking\`.\`feedback\` (
        \`user_id\`,
        \`hotel_id\`,
        \`rating\`,
        \`comment\`,
        \`created_at\`
      )
      VALUES (?, ?, ?, ?, ?);
    `;
    
    const values = [user_id, hotel_id, rating, comment, created_at];
    
    const [result] = await pool.query(query, values)

    res.json({
      success: true,
      message: 'feedback successfully created',
      result: result
    });
      
    } catch (error) {
      console.error('Error posting reservations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




  
module.exports = router;