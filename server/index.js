require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./connect');
const authRoutes = require('./routes/authRoute');
const app = express();
const cookiesParser = require('cookie-parser');
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./model/auth");

app.use(cors({
    origin: process.env.FRONTEND_URL, // your frontend URL
    credentials: true,
}));
app.use(express.json());
app.use(cookiesParser());

connectDB(process.env.MONGO_URI);

app.use(
  session({
    secret: "googleauth",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          email: profile.emails[0].value,
        });

        if (!user) {
          user = await User.create({
            fullname: profile.displayName,
            email: profile.emails[0].value,
            password: "googlelogin",
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

app.use('/', authRoutes);

app.listen(process.env.PORT || 3100, () => {console.log(`Server is running on port ${process.env.PORT}`)});