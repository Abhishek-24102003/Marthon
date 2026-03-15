import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/user.model.js";
export const GoogleStrategyConfig = ()=> passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLECLIENT_ID,
      clientSecret: process.env.GOOGLECLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/callback/google",
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      const email = profile.emails[0].value;
      const userName = profile.name.givenName;
      const googleId = profile.id;
      const user = await UserModel.findOne({ email });
        if (user) {
            console.log("All ready registered");
            return cb( null,user);
        }
      const newUser = await UserModel.create({
        userName,
        email,
        password: "12345678",
        mobile: 8349839914,
        googleId,
        authProvider: "google",
      });
      return cb(null, newUser);
    },
  ),
);