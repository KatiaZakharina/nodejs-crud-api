import http from 'http';

import config from './config';
import userApi from './resources/user/user.api';

const requestErrorWrapper = (requestListener: http.RequestListener) => {
  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      requestListener(req, res);
    } catch (err) {
      console.log(err, 'sdfsd');

      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Internal server error' }));
    }
  };
};

const requestListener = async (req: http.IncomingMessage, res: http.ServerResponse) => {
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

const startServer = () => {
  const { host, port } = config;

  const requestListenerWithErrorHandler = requestErrorWrapper(requestListener);
  const server = http.createServer(requestListenerWithErrorHandler);

  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });

  return server;
};

export default startServer;
