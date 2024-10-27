// api/routes/hotels.js
const express = require('express');
const router = express.Router();
const pool = require('../database.js');

/** GET */

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hotels');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM hotels WHERE id = ${req.params.id}`);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/name/:name', async (req, res) => {
    try {
      const searchTerm = `${req.params.name}`;
      const [rows] = await pool.query(`SELECT * FROM hotels WHERE name = ?`, [searchTerm]);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/city/:name', async (req, res) => {
    try {
      const searchTerm = `${req.params.name}`;
      const [rows] = await pool.query(`SELECT H.* FROM booking.hotels H
LEFT JOIN cities C ON H.city_id = C.id
WHERE C.name = '${searchTerm}'`);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/amenities/:keyword', async (req, res) => {
    try {
      const searchTerm = `%${req.params.keyword}%`;
      const [rows] = await pool.query(`SELECT * FROM hotels WHERE amenities LIKE ?`, [searchTerm]);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  /**POST */

  router.post('/new', async (req, res) => {
    try {
      const payload = req.body;
      const sql = `
        INSERT INTO hotels 
        (name, address, city_id, total_rooms, amenities, description, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
  
      const [result] = await pool.query(sql, [
        payload.name,
        payload.address,
        payload.city_id,
        payload.total_rooms,
        payload.amenities,
        payload.description
      ]);
  
      res.json({
        success: true,
        message: 'Hotel added successfully',
        hotelId: result.insertId
      });
    } catch (error) {
      console.error('Error adding new hotel:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  /** UPDATE */

/** PUT - Update an existing hotel by ID */
router.put('/update/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const payload = req.body;
  
      const sql = `
        UPDATE hotels 
        SET 
          name = ?, 
          address = ?, 
          city_id = ?, 
          total_rooms = ?, 
          amenities = ?, 
          description = ?, 
          updated_at = NOW() 
        WHERE id = ?`;
  
      const [result] = await pool.query(sql, [
        payload.name,
        payload.address,
        payload.city_id,
        payload.total_rooms,
        payload.amenities,
        payload.description,
        id
      ]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Hotel not found' });
      }
  
      res.json({
        success: true,
        message: 'Hotel updated successfully'
      });
    } catch (error) {
      console.error('Error updating hotel:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  /**DELETE */

/** DELETE - Remove a hotel by ID */
router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const sql = 'DELETE FROM hotels WHERE id = ?';
      const [result] = await pool.query(sql, [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Hotel not found' });
      }
  
      res.json({
        success: true,
        message: 'Hotel deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting hotel:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  


module.exports = router;
