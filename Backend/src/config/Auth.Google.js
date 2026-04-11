import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/user.model.js";

export const GoogleStrategyConfig = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLECLIENT_ID,
        clientSecret: process.env.GOOGLECLIENT_SECRET,
        callbackURL: "https://marthon.onrender.com/api/auth/callback/google",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 🔹 Extract user data from Google profile
          const email = profile.emails?.[0]?.value;
          const userName = profile.name?.givenName || profile.displayName;
          const googleId = profile.id;

          if (!email) {
            return done(new Error("Email not found from Google"), null);
          }

          // 🔹 Check if user already exists
          let user = await UserModel.findOne({ email });

          if (user) {
            // 🔹 If user exists, just return
            return done(null, user);
          }

          // 🔹 Create random password (since Google user doesn't set one)
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashPass = await bcrypt.hash(randomPassword, 10);

          // 🔹 Create new user
          user = await UserModel.create({
            userName,
            email,
            password: hashPass,
            googleId,
            authProvider: "google",
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};