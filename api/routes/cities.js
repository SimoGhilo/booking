// api/routes/cities.js
const express = require('express');
const router = express.Router();
const pool = require('../database.js');


router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT name,country FROM cities');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get('/:name', async (req, res) => {

    let searchTerm = req.params.name
    try {
      const [rows] = await pool.query(`SELECT name,country, id FROM cities WHERE name LIKE '%${searchTerm}%' OR  country LIKE '%${searchTerm}%'`);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  
module.exports = router;