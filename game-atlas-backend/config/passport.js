const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find existing user by Google ID first
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if email already exists (linked account)
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            // Link Google ID to existing account
            user.googleId = profile.id;
            if (!user.profilePic && profile.photos?.length > 0) {
              user.profilePic = profile.photos[0].value;
            }
            await user.save();
          } else {
            // Brand new user via Google
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              profilePic: profile.photos?.length > 0 ? profile.photos[0].value : null,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
