import http from 'http';

function startServer() {
  const host = 'localhost';
  const port = 4000;

    const server = http.createServer(()=>({a: 1}));

    server.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
}

startServer();