import { Router } from 'express';

import usersRouter from './routes/users_route/users';
import authRouter from './routes/auth_route/auth';
import booksRouter from './routes/books_route/books';

const v1Router = Router();

v1Router.use('/users', usersRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/book', booksRouter);

export default v1Router;
