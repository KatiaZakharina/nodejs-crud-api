import { ServerResponse } from 'http';

import { validateUserId } from './../user.helpers';
import userService from '../user.service';

const getById = (id: string, res: ServerResponse) => {
  const isValid = validateUserId(id, res);

  if (!isValid) {
    return;
  }

  const user = userService.getById(id);

  if (!user) {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'User not found'}));
    return;
  }

  res.writeHead(200);
  res.end(JSON.stringify(user));
};

export default getById;
