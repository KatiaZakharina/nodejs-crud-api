import { ServerResponse } from 'http';

import { validateUserId } from './../user.helpers';
import userService from '../user.service';

const remove = (id: string, res: ServerResponse) => {
  const isValid = validateUserId(id, res);

  if (!isValid) {
    return;
  }

  const isRemoved = userService.remove(id);

  if (!isRemoved) {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  res.writeHead(204);
  res.end();
};

export default remove;
