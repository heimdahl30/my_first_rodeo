import mongoose, { Document } from 'mongoose';

interface IBlog extends Document {
  title: string;
  likes: number;
  url: string;
  author: mongoose.Types.ObjectId;
}

const blogSchema = new mongoose.Schema<IBlog>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Blog = mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
