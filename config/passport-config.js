/* //This file will contain the configuration for the passport library.



// backend/logic/passport-config.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');
const AuthModel = require('../model/AuthModel');

// Local strategy for user login
passport.use('user-local', new LocalStrategy({
    usernameField: 'email', // Assuming email is used as username
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await AuthModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// JWT strategy for user authentication
passport.use('user-jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_USER,
}, async (jwtPayload, done) => {
    try {
        const user = await AuthModel.findById(jwtPayload.userId);
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

module.exports = passport;
 */