import request from 'supertest';
import assert from 'assert';
import { v4 as uuid } from 'uuid';

import startServer from '../server';
import { COLLECTION_CONSTANTS, localDB } from '../localDB';

const MOCK_USER = {
  username: 'John Doe',
  hobbies: ['hobby1', 'hobby2'],
  age: 20
};

const MOCK_INVALID_USER = {
  username: 1234,
  hobbies: [1, null],
  age: '20'
}

const app = startServer();

describe('GET /api/users', () => {
  it('should return an empty array', async () => {
    const res = await request(app).get('/api/users');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, []);
  });
});

describe('POST /api/users', () => {
  it('should return a new object', async () => {
    const res = await request(app).post('/api/users').send(MOCK_USER);

    assert.equal(res.status, 201);
    assert.deepEqual(res.body, {
      id: res.body.id,
      ...MOCK_USER
    });
  });
});

describe('PATCH /api/users', () => {
  it('should return an error', async () => {
    const res = await request(app).patch('/api/users').send(MOCK_USER);

    assert.equal(res.status, 405);
    assert.deepEqual(res.body, {
      message: 'Method not allowed'
    });
  });
});

describe('with specific user', () => {
  let createdUser: any;
  const initialLocalDB = localDB;

  beforeAll(async () => {
    createdUser = {
      id: uuid(),
      ...MOCK_USER
    };
    localDB[COLLECTION_CONSTANTS.USERS].push(createdUser);
  });

  afterAll(() => {
    Object.assign(localDB, initialLocalDB);
  });

  describe('GET /api/users/:userId', () => {
    it('should return a created object', async () => {
      const res = await request(app).get(`/api/users/${createdUser.id}`);

      assert.equal(res.status, 200);
      assert.deepEqual(res.body, createdUser);
    });
  });

  describe('PUT /api/users/:userId', () => {
    it('should return an updated object', async () => {
      const res = await request(app)
        .put(`/api/users/${createdUser.id}`)
        .send({
          ...MOCK_USER,
          username: 'New name'
        });

      assert.equal(res.status, 200);
      assert.deepEqual(res.body, {
        id: createdUser.id,
        ...MOCK_USER,
        username: 'New name'
      });
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should delete user', async () => {
      const res = await request(app).delete(`/api/users/${createdUser.id}`);

      assert.equal(res.status, 204);

      assert.equal(
        localDB[COLLECTION_CONSTANTS.USERS].findIndex((user) => user.id === createdUser.id),
        -1
      );
    });
  });

  describe('PATCH /api/users/:userId', () => {
    it('should return an error', async () => {
      const res = await request(app).patch(`/api/users/${createdUser.id}`).send(MOCK_USER);

      assert.equal(res.status, 405);
      assert.deepEqual(res.body, {
        message: 'Method not allowed'
      });
    });
  });
});

describe('GET random url', () => {
  it('should return an error', async () => {
    const res = await request(app).get('/api/random');

    assert.equal(res.status, 404);
    assert.deepEqual(res.body, {
      message: 'Not found'
    });
  });
});

describe('With non existing user', () => {
  describe('GET /api/users/:userId', () => {
    it('should return an error', async () => {
      const res = await request(app).get(`/api/users/${uuid()}`);

      assert.equal(res.status, 404);
      assert.deepEqual(res.body, {
        message: 'User not found'
      });
    });
  });

  describe('PUT /api/users/:userId', () => {
    it('should return an error', async () => {
      const res = await request(app).put(`/api/users/${uuid()}`).send(MOCK_USER);

      assert.equal(res.status, 404);
      assert.deepEqual(res.body, {
        message: 'User not found'
      });
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should return an error', async () => {
      const res = await request(app).delete(`/api/users/${uuid()}`);

      assert.equal(res.status, 404);
      assert.deepEqual(res.body, {
        message: 'User not found'
      });
    });
  });
});

describe('With invalid user', () => {
  describe('POST /api/users', () => {
    it('should return an error', async () => {
      const res = await request(app).post('/api/users').send(MOCK_INVALID_USER);

      assert.equal(res.status, 400);
      assert.deepEqual(res.body, {
        message: 'User is invalid'
      });
    });
  });
});

describe('With invalid user id', () => {  
  describe('GET /api/users/:userId', () => {
    it('should return an error', async () => {
      const res = await request(app).get(`/api/users/1234`);

      assert.equal(res.status, 400);
      assert.deepEqual(res.body, {
        message: 'User id is invalid'
      });
    });
  });
});
