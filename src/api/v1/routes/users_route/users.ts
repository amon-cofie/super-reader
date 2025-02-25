import { Router } from 'express';

import { PrismaClient } from '@prisma/client';

const usersRouter = Router();
const prisma = new PrismaClient();

usersRouter.get('/', (req, res) => {
  console.log('user is: ', req.user);
});

export default usersRouter;
