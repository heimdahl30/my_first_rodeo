import { Router } from 'express';
import {
  getAllBlogs,
  getOneBlog,
  createBlog,
  likeBlog,
  deleteBlog,
} from '../controllers/blog-controllers.js';
import tokenExtractor from '../middleware/tokenExtractor.js';

const blogRouter = Router();

blogRouter.get('/', getAllBlogs);
blogRouter.post('/newBlog', tokenExtractor, createBlog);
blogRouter.get('/:id', getOneBlog);
blogRouter.put('/likeBlog/:id', likeBlog);
blogRouter.delete('/:id', tokenExtractor, deleteBlog);

export default blogRouter;
