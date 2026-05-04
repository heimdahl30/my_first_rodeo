import { Router } from 'express';
import validate from '../validators/validation.js';
import {
  userLoginValidationSchema,
  userSignUpValidationSchema,
} from '../validators/validationSchema.js';
import {
  createUser,
  getAllUsers,
  loginUser,
  logoutUser,
  verifyUser,
  getOneUser,
} from '../controllers/user-controller.js';
import tokenExtractor from '../middleware/tokenExtractor.js';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.post('/signup', validate(userSignUpValidationSchema), createUser);
userRouter.post('/login', validate(userLoginValidationSchema), loginUser);
userRouter.get('/auth-status', tokenExtractor, verifyUser);
userRouter.post('/logout', logoutUser);
userRouter.get('/:id', getOneUser);

export default userRouter;
