// backend/middleware/passport.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const AuthModel = require('../model/AuthModel'); // Assuming you have a model for authentication

// Configure the local strategy for username and password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Assuming email is used as the username
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await AuthModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'Incorrect email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return done(null, false, { message: 'Incorrect email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configure the JWT strategy for token-based authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_USER, // Change this to your JWT secret
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await AuthModel.findById(jwtPayload.userId);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

module.exports = passport;
    