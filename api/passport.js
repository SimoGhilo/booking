const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const findUserByEmail = require('./auth/user.js')

passport.use(new LocalStrategy(
    function(email, password, done) {
        findUserByEmail(email, (err, user) => {
          /**TODO The below function is not being triggered */
          console.log('I am being ussed!', user, email, '!');
        if (err) { return done(err); } 
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Incorrect password or username' });
        }
        return done(null, user); // Authentication successful
      });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    findUserById(id, (err, user) => {
      done(err, user);
    });
  });
  


module.exports = passport;