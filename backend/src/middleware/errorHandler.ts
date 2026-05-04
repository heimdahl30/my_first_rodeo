import type { Request, Response, NextFunction } from 'express';

interface BackendError extends Error {
  status?: number;
}

const errorHandler = (
  error: BackendError,
  _req: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  console.error(error);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response.status(400).json({ error: 'email should be unique' });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired, login again' });
  }
  return response
    .status(500)
    .json({ error: 'An unexpected server error occurred' });
};

export default errorHandler;
