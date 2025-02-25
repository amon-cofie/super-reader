import { NextFunction, Response } from 'express';

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('Running Error Handler... ');
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  const responseBody = {
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'warn' : error.stack,
  };
  console.error('Error: ', responseBody);
  res.json(responseBody);
};

export default errorHandler;
