import { IncomingMessage } from 'http';

const getBody = (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
};

export const parseBody = async (req: IncomingMessage) => {
  const body = await getBody(req);

  return JSON.parse(body);
};
