import http from 'http';

import config from './config';
import userApi from './resources/user/user.api';

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

function requestErrorWrapper(requestListener: http.RequestListener) {
  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
      requestListener(req, res);
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Internal server error' }));
    }
  };
}

const requestListener = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.setHeader('Content-Type', 'application/json');

  console.log(req.url);

  switch (req.url) {
    case '/api/users':
      switch (req.method) {
        case 'GET':
          return userApi.list(res);
        case 'POST':
          return userApi.create(req, res);
        default:
          res.writeHead(405);
          res.end(JSON.stringify({ message: 'Method not allowed' }));
      }
      break;
    case `/api/users/${req.url.split('/')[3]}`:
      const id = req.url.split('/')[3];

      switch (req.method) {
        case 'GET':
          return userApi.getById(id, res);
        case 'PUT':
          return userApi.update(id, req, res);
        case 'DELETE':
          return userApi.remove(id, res);
        default:
          res.writeHead(405);
          res.end(JSON.stringify({ message: 'Method not allowed' }));
      }
      break;
    default:
      res.writeHead(404);
      res.end(JSON.stringify({ message: 'Not found' }));
  }
};

function startServer() {
  const { host, port } = config;

  const requestListenerWithErrorHandler = requestErrorWrapper(requestListener);
  const server = http.createServer(requestListenerWithErrorHandler);

  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

startServer();
