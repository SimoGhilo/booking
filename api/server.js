const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const User = require('./auth/user');
/**Data sanitisation and validation library */
const { body, validationResult } = require('express-validator');

/** JSON */
app.use(express.json());

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
app.post(
  '/api/register',
  // Sanitize and validate the inputs using express-validator
  [
    // Name validation and sanitization
    body('name')
      .trim()
      .notEmpty().withMessage('First name is required.')
      .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long.')
      .escape(),

    // Surname validation and sanitization
    body('surname')
      .trim()
      .notEmpty().withMessage('Last name is required.')
      .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long.')
      .escape(),

    // Email validation and sanitization
    body('email')
      .trim()
      .isEmail().withMessage('Please provide a valid email address.')
      .normalizeEmail(),

    // Password validation
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
      .matches(/\d/).withMessage('Password must contain at least one number.')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
  ],
  async (req, res) => {
    console.log('Received body:', req.body); 
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation fails, return a 400 response with the validation error messages
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, password } = req.body;

    try {
      // Hash the password using bcrypt
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Create the user in the database (assuming User.createUser exists)
      User.createUser(name, email, hashedPassword, surname);

      // If user creation is successful, send success response
      res.status(201).json({ message: 'User registered successfully.' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Registration failed. Please try again later.' });
    }
  }
);

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
const ratesRouter = require('./routes/rates');


/** Routes */

app.use('/api/hotels', hotelsRouter);

app.use('/api/cities', citiesRouter);

app.use('/api/rates', ratesRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
