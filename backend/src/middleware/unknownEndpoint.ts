import type { Request, Response } from 'express';

const unknownEndpoint = (request: Request, response: Response) => {
  return response.status(404).json({ error: 'unknown endpoint' });
};

export default unknownEndpoint;
