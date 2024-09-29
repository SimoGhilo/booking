
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

//MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'booking'
});

const findUserByEmail = (email, callback) => {
  pool.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    return callback(null, results[0]);
  });
};

const findUserById = (id, callback) => {
  pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    return callback(null, results[0]);
  });
};

const createUser = (name, email, hashedPassword, surname, callback) => {
  pool.query("INSERT INTO users (`name`, `email`, `password`, `created_at`,`surname`)  VALUES ()", [name,email,hashedPassword,new Date().toISOString(), surname ], (err, results) => {
    /**TODO: Error here in backend, callback is not a function, error feedback to user */
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    return callback(null, true);
  });
};



module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};
