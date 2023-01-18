import { ServerResponse } from 'http';

import userService from '../user.service';

const list = async (res: ServerResponse) => {
  const users = userService.get();

  res.writeHead(200);
  res.end(JSON.stringify(users));
};

export default list;
