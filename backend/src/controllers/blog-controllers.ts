import type { Request, Response, NextFunction } from 'express';
import Blog from '../models/Blog.js';
import User from '../models/User.js';

interface CreateBlogBody {
  title: string;
  url: string;
  author: string;
  likes: number;
}

export const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogs = await Blog.find({}).populate('author', 'name').lean();
    return res.status(200).json({ blogs });
  } catch (error) {
    return next(error);
  }
};

export const getOneBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate('author', 'name').lean();
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    return res.status(200).json({ blog });
  } catch (error) {
    return next(error);
  }
};

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = res.locals.jwtData;

    const { title, url, likes } = req.body as CreateBlogBody;
    const author = id;

    const blog = await Blog.create({
      title,
      url,
      ...(likes && { likes }),
      author,
    });

    blog.populate('author', 'name');

    const user = await User.findByIdAndUpdate(id, {
      $push: { blogs: blog.id },
    });

    return res
      .status(201)
      .json({ message: 'Blog successfully created', blog, user });
  } catch (error) {
    return next(error);
  }
};

export const likeBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { returnDocument: 'after' }
    ).populate('author', 'name');

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    return next(error);
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = res.locals.jwtData;
    const blogID = req.params.id;
    const blog = await Blog.findById(blogID);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.author.toString() !== id) {
      return res
        .status(403)
        .json({ error: 'Only author can delete this blog.' });
    }

    await Blog.findByIdAndDelete(blogID);
    await User.findByIdAndUpdate(id, { $pull: { blogs: blogID } });
    return res.status(200).json({ message: 'Blog successfully deleted' });
  } catch (error) {
    return next(error);
  }
};

/* delete blog using Mongoose Transactions which ensures that success is only considered when all operations succeed else even if one operation fails, all others are rolled back

export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Start a session
  const session = await mongoose.startSession();

  try {
    // 2. Start the transaction
    session.startTransaction();

    const { id: userId } = res.locals.jwtData;
    const blogID = req.params.id;

    // Use the session in findById
    const blog = await Blog.findById(blogID).session(session);

    if (!blog) {
      // If blog is missing, end the session and return
      await session.endSession();
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.author.toString() !== userId) {
      await session.endSession();
      return res.status(403).json({ error: 'Only author can delete this blog.' });
    }

    // 3. Perform deletes/updates within the transaction
    // MUST pass { session } to these methods
    await Blog.findByIdAndDelete(blogID, { session });
    await User.findByIdAndUpdate(userId, { $pull: { blogs: blogID } }, { session });

    // 4. Commit everything to the database
    await session.commitTransaction();

    return res.status(200).json({ message: 'Blog successfully deleted' });
  } catch (error) {
    // 5. If ANY operation above fails, undo ALL changes
    await session.abortTransaction();
    return next(error);
  } finally {
    // 6. Always close the session to free up resources
    await session.endSession();
  }
};
*/
