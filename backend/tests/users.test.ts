import { describe, test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';
import setupDB from './db-helper.js';

const agent = request.agent(app);

describe('User routes', () => {
  setupDB();
  test('get all users', async () => {
    const res = await agent.get('/api/v1/users');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.users);
  });

  test('signup a user', async () => {
    const res = await agent.post('/api/v1/users/signup').send({
      name: 'Abhinav',
      email: 'abhinav@test.com',
      password: 'abhinavsingh',
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.name, 'Abhinav');
  });

  test('log in a user', async () => {
    const signupres = await agent.post('/api/v1/users/signup').send({
      name: 'Abhinav',
      email: 'abhinav@test.com',
      password: 'abhinavsingh',
    });

    assert.strictEqual(
      signupres.status,
      201,
      'Signup failed before login could start'
    );

    const res = await agent
      .post('/api/v1/users/login')
      .send({ email: 'abhinav@test.com', password: 'abhinavsingh' });

    const cookies = res.headers['set-cookie'];

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.name, 'Abhinav');
    assert.strictEqual(res.body.email, 'abhinav@test.com');
    assert.ok(cookies, 'Response should have set-cookie header');
  });

  test('get single user, check auth-status, log out user', async () => {
    // user signup
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

    // user login
    const res = await agent
      .post('/api/v1/users/login')
      .send({ email: 'abhinav@test.com', password: 'abhinavsingh' });
    assert.strictEqual(
      res.status,
      200,
      'Status did not match during login in the combined tests for users'
    );

    // fetch single user
    const { id } = signupres.body;
    const singleuserres = await agent.get(`/api/v1/users/${id}`);
    assert.strictEqual(
      singleuserres.status,
      200,
      'Status did not match while fetching a single user in the combined tests'
    );
    assert.strictEqual(singleuserres.body.user.name, 'Abhinav');

    // check if user is logged in

    const authcheckres = await agent.get('/api/v1/users/auth-status');

    assert.strictEqual(
      authcheckres.status,
      200,
      'Status did not match during auth-check in combined tests'
    );
    assert.strictEqual(authcheckres.body.message, 'User is already logged in');

    // log out user
    const logoutuserres = await agent.post('/api/v1/users/logout');

    assert.strictEqual(
      logoutuserres.status,
      200,
      'Status did not match during logout in combined tests'
    );
    assert.strictEqual(logoutuserres.body.message, 'Logged out successfully');
  });
});
