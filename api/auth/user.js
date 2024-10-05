
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

//MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'booking'
});

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = ?", 
      [email], 
      (err, results) => {
        if (err) return reject(err);
        // Check if the user was created successfully
        return resolve(results.affectedRows > 0); // Resolve true if a row was affected
      }
    );
  });
};

const findUserById = (id, callback) => {
  pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    return callback(null, results[0]);
  });
};

const createUser = (name, email, hashedPassword, surname) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users (`name`, `email`, `password`, `updated_at`, `surname`) VALUES (?, ?, ?, ?, ?)", 
      [name, email, hashedPassword, new Date().toISOString(), surname], 
      (err, results) => {
        if (err) return reject(err);
        // Check if the user was created successfully
        return resolve(results.affectedRows > 0); // Resolve true if a row was affected
      }
    );
  });
};




module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};
