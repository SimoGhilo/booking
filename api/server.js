const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const User = require('./auth/user');

/** Session */

const session = require('express-session');
const bcrypt = require('bcryptjs');

// Session configuration
app.use(session({
    secret: 'somesecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } 
  }));
  
  // Passport JS
  const passport = require('./passport'); 

  // Initialize passport and use session for storing user information
  app.use(passport.initialize());
  app.use(passport.session());


/** Auth routes */

// Registration route
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  User.createUser(username, hashedPassword, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Registration failed.');
    }
    res.redirect('/login');
  });
});

// Login route
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })
);

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
});



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cors')());

/** Routes files */
const hotelsRouter = require('./routes/hotels');
const citiesRouter = require('./routes/cities');


/** Routes */

app.use('/api/hotels', hotelsRouter);

app.use('/api/cities', citiesRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
