const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { findUserByEmail, findUserById } = require('./auth/user'); 
const bcrypt = require('bcrypt'); 

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {

    findUserByEmail(email)
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password' });
        }
        // Check the password
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Incorrect password or username' });
        }
        return done(null, user); // Authentication successful
      })
      .catch(err => {
        console.error('Error during user lookup:', err); 
        return done(err);
      });
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
  findUserById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
