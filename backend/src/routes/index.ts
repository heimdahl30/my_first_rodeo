import { Router } from 'express';
import userRouter from './user-routes.js';
import blogRouter from './blog-routes.js';

const appRouter = Router();

appRouter.use('/users', userRouter);
appRouter.use('/blogs', blogRouter);

export default appRouter;
