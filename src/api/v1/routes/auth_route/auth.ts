import { Router } from 'express';
import { createUer, findUser } from '../../../../db/script';
import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcrypt');
import { ensureAuthenticated } from '../../middlewares/auth';

const passport = require('passport');
require('./passport.ts');

// var passport = require('passport');
// var LocalStrategy = require('passport-local');

const authRouter = Router();

const prisma = new PrismaClient();

// api/v1/auth/sign_in
authRouter.post('/sign_in', (req, res) => {
  console.log('request body: ', req.body);

  // query the db
  // check if the user passwords and username match

  passport.authenticate('local', (error: any, user: any, info: any) => {
    if (error) {
      return res.status(500).json({
        error: 'Something went wrong',
      });
    }

    if (!user) {
      return res.status(401).json(info);
    }

    req.login(user, (error: any) => {
      if (error) {
        return res.status(500).json({
          error: 'Something went wrong',
        });
      }
      return res.status(200).json({ message: 'user signed in successfully', user: user });
    });
  })(req, res);
});

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: false }),
  (req, res) => {
    console.log('google auth has been established', req.user);
    res.redirect('http://localhost:5173/');
  },
);

authRouter.get('/sign_out', async (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }

    res.status(204).send();
  });
});

authRouter.post('/sign_up', async (req: any, res: any) => {
  /// For now we are only doing auth with username and password
  const authOptions = req.body;

  try {
    // do some validation on the request parameters first
    if (!authOptions.name || !authOptions.username || !authOptions.password || !authOptions.email) {
      return res.status(422).json({ error: 'name, username, email and password are all required' });
    }

    // checking if a user already exists with the email or username
    const possibleExistingUser = await findUser({
      username: authOptions.username,
      email: authOptions.email,
    });

    if (possibleExistingUser?.email == authOptions.email) {
      return res.status(409).json({
        error: 'email already in use',
      });
    }

    if (possibleExistingUser?.username == authOptions.username) {
      return res.status(409).json({
        error: `${authOptions.username} is already taken`,
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(authOptions.password, 10);

    console.log('here is the point where we create the user', hashedPassword);

    await createUer({
      name: authOptions.name,
      username: authOptions.username,
      email: authOptions.email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'user created' });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
});

authRouter.get('/me', ensureAuthenticated, (req, res) => {
  console.log('getting logged in user');
  res.json(req.user);
});

export default authRouter;
