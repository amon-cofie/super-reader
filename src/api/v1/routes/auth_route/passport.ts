import { PrismaClient, User } from '@prisma/client';
import { findUser } from '../../../../db/script';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');

// const LocalStrategy = passportLocal.Strategy;

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy({}, async (username: string, password: string, done: any) => {
    try {
      // getting the user with these details
      const user: User = await prisma.user
        .findUnique({
          where: {
            username: username,
            OR: [{ email: username }, { username: username }],
          },
        })
        .catch((error) => {
          console.log('Error getting user', error);
          return done(error);
        })
        .finally(() => {
          prisma.$disconnect();
        });

      // checking if a user with the details was found
      if (!user) {
        return done(null, false, { error: 'Incorrect username, email or password' });
      }

      const passwordsMatchP = await bcrypt.compare(password, user.password);

      if (!passwordsMatchP) {
        console.log('the passwords simply do not match');
        return done(null, false, { error: 'Incorrect username, email or password' });
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH20_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH20_CLIENT_SECRET,
      callbackURL: '/api/v1/auth/google/callback',
    },

    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            googleId: profile.id,
            OR: [{ googleId: profile.id }, { email: profile.emails[0].value }],
          },
        });

        // if (user?.email == profile.emails[0].value){
        //   done(null, false, {error: "user already exists with this email"})
        // }

        if (user) {
          return done(null, user);
        }

        const newUser = await prisma.user.create({
          data: {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          },
        });

        done(null, newUser);
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.serializeUser((user: User, done: any) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (userId: any, done: any) => {
  console.log('Deserializing user ID:', userId);
  try {
    const user: User = await prisma.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .catch((error) => {
        console.log('Error getting user', error);
        return done(error);
      })
      .finally(() => {
        prisma.$disconnect();
      });

    if (!user) {
      return done(new Error('user not found'));
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});
