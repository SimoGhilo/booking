const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const User = require('./auth/user');
/**Data sanitisation and validation library */
const { body, validationResult } = require('express-validator');

/** JSON */
app.use(express.json());

/**CORS */

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Specify your frontend URL
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions)); // Use the CORS middleware

/** Session */

const session = require('express-session');
const bcrypt = require('bcryptjs');

// Session configuration  
app.use(session({
    secret: 'somesecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
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

      // Create the user in the database
      User.createUser(name, email, hashedPassword, surname, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Registration failed. Please try again later.' });
        }
        return res.status(201).json({ message: 'User registered successfully.' });
      });

      // If user creation is successful, send success response
      res.status(201).json({ message: 'User registered successfully.' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Registration failed. Please try again later.' });
    }
  }
);

/***Protect routes middleware */

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // If authenticated, proceed to the next middleware
  }
  // If not authenticated, send a 401 Unauthorized response
  return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
}

/**TODO: above is only to protect endpoint on the backend. Routes need protecting for getting user data */

// // Protect the /dashboard route with the isAuthenticated middleware
// app.get('/dashboard', isAuthenticated, (req, res) => {
//   // If the user is authenticated, this code will run
//   res.json({ message: 'Welcome to the dashboard!', user: req.user });
// });

/**This is to protect access to protected component on the frontend */

// Route to check authentication status
app.get('/auth/check', isAuthenticated, (req, res) => {
  res.json({ authenticated: true, user: req.session.user });
}); 


// Login route
app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred during login. Please try again later.' });
    }
    if (!user) {
      // User not found or invalid credentials
      return res.status(401).json({ message: info.message || 'Invalid username or password.' });
    }

    // Successful authentication
    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while logging in. Please try again later.' });
      }

      // Respond with success
      req.session.user = {user};
      return res.json({ message: 'Login successful', user });
    });
  })(req, res, next); // Important: pass req, res, and next to the authenticate function
});


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
