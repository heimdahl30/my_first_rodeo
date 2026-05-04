import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';
import setupDB from './db-helper.js';

const agent = request.agent(app);

describe('Blog routes', () => {
  setupDB();
  test('get all blogs', async () => {
    const res = await agent.get('/api/v1/blogs');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.blogs);
  });

  test('create a blog, get a single blog, like a blog, delete a blog', async () => {
    // sign up user
    const signupres = await agent.post('/api/v1/users/signup').send({
      name: 'Abhinav',
      email: 'abhinav@test.com',
      password: 'abhinavsingh',
    });
    assert.strictEqual(
      signupres.status,
      201,
      'Signup failed before login could start in the combined tests'
    );

    // log in user
    const loginres = await agent
      .post('/api/v1/users/login')
      .send({ email: 'abhinav@test.com', password: 'abhinavsingh' });
    assert.strictEqual(
      loginres.status,
      200,
      'Status did not match during login in the combined tests for users'
    );

    console.log('loginres body', loginres.body);

    // create a blog
    const blogres = await agent
      .post('/api/v1/blogs/newBlog')
      .send({ title: 'Test Blog', url: 'www.testblog.com' });
    assert.strictEqual(blogres.status, 201);
    assert.strictEqual(blogres.body.message, 'Blog successfully created');

    // get a single blog
    // eslint-disable-next-line no-underscore-dangle
    const blogId = blogres.body.blog._id;
    const singleblogres = await agent.get(`/api/v1/blogs/${blogId}`);
    assert.strictEqual(singleblogres.status, 200);
    assert.ok(singleblogres.body.blog);

    // like a blog
    const likesBefore = blogres.body.blog.likes;
    const liketheblogres = await agent.put(`/api/v1/blogs/likeBlog/${blogId}`);
    console.log('check liked blog', liketheblogres.body.blog);
    const likesAfter = liketheblogres.body.blog.likes;
    assert.strictEqual(likesAfter, likesBefore + 1);

    // delete a blog
    const deleteblogres = await agent.delete(`/api/v1/blogs/${blogId}`);
    assert.strictEqual(deleteblogres.status, 200);
    assert.strictEqual(deleteblogres.body.message, 'Blog successfully deleted');
  });
});

// 69f82b36e1ab9813e13db599
