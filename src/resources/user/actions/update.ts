import { IncomingMessage, ServerResponse } from 'http';

import { parseBody } from './../../../helpers/parseBody';
import { validateUser, validateUserId } from './../user.helpers';
import userService from '../user.service';

const update = async (id: string, req: IncomingMessage, res: ServerResponse) => {
  const isIdValid = validateUserId(id, res);

  if (!isIdValid) {
    return;
  }

  const storedUser = userService.getById(id);

  if (!storedUser) {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'User not found'}));
    return;
  }
  
  const user = await parseBody(req);
  const transformedUser = { ...storedUser, ...user };
  const isUserValid = validateUser(transformedUser, res);

  if (!isUserValid) {
    return;
  }
  
  const updatedUser = userService.update(id, transformedUser);

  res.writeHead(200);
  res.end(JSON.stringify(transformedUser));
};

export default update;
