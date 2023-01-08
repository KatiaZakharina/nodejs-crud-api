import 'dotenv/config';

import http from 'http';

import { User } from './types';

// GET api/users is used to get all persons
// Server should answer with status code 200 and all users records
// GET api/users/${userId}
// Server should answer with status code 200 and and record with id === userId if it exists
// Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
// Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
// POST api/users is used to create record about new user and store it in database
// Server should answer with status code 201 and newly created record
// Server should answer with status code 400 and corresponding message if request body does not contain required fields
// PUT api/users/{userId} is used to update existing user
// Server should answer with status code 200 and updated record
// Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
// Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
// DELETE api/users/${userId} is used to delete existing user from database
// Server should answer with status code 204 if the record is found and deleted
// Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
// Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

function startServer() {
  const host = 'localhost';
  const port = parseInt(process.env.SERVER_PORT, 10) || 4000;

  const localDB: User[] = [{
    id: '1',
    username: 'John',
    age: 25,
    hobbies: ['football', 'basketball'],
  }];

  const requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.setHeader("Content-Type", "application/json");

    switch (req.url) {
      case '/api/users':
        switch (req.method) {
          case 'GET':
            res.writeHead(200);
            res.end(JSON.stringify(localDB));
            break;
          case 'POST':
            localDB.push();
            res.writeHead(201);
            res.end(JSON.stringify({}));
            break;
          default:
            res.writeHead(405);
            res.end(JSON.stringify({ message: 'Method not allowed' }));
        }
      break;
      case `/api/users/${req.url.split('/')[3]}`:
        switch (req.method) {
          case 'GET':
            res.writeHead(200);
            res.end(JSON.stringify({}));
            break;
          case 'PUT':
            res.writeHead(200);
            res.end(JSON.stringify({}));
            break;
          case 'DELETE':
            res.writeHead(204);
            res.end();
            break;
          default:
            res.writeHead(405);
            res.end(JSON.stringify({ message: 'Method not allowed' }));
        }
      break;
      default:
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Not found' }));
    }

    res.writeHead(200);
    res.end('Hello, World!');
  }

  const server = http.createServer(requestListener);

  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

startServer();