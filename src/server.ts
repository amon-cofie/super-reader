import errorHandler from './api/v1/middlewares/errorHandler';
import v1 from './api/v1/v1';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const express = require('express');
import session from 'express-session';
const bcrypt = require('bcrypt');
const passport = require('passport');
const app = express();

app.use(express.json({ limit: '1000mb' }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));

// var sess = {
//   secret: 'keyboard cat',
//   cookie: {}
// }

// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sess.cookie.secure = true // serve secure cookies
// }
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'my-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: false,
      // sameSite: 'none',
      httpOnly: true,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1', v1);

app.get('/', async (req: any, res: any) => {
  console.log('if it works here, it is global', req.user);
  res.json({ message: 'works everywhere', user: req.user ?? 'user is undefined' });
});

// app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
