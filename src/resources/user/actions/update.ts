import { IncomingMessage, ServerResponse } from 'http';

import { parseBody } from './../../../helpers/parseBody';
import { validateUser, validateUserId } from './../user.helpers';
import userService from '../user.service';

const update = async (id: string, req: IncomingMessage, res: ServerResponse) => {
  const isIdValid = validateUserId(id, res);

  const storedUser = userService.getById(id);

  if (!storedUser) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'User not found'}));
    return;
  }
  
  const user = await parseBody(req);
  const transformedUser = { ...storedUser, ...user };
  const isUserValid = validateUser(transformedUser, res);

  if (!isIdValid || !isUserValid) {
    return;
  }
  
  const updatedUser = userService.update(id, transformedUser);

  if (!updatedUser) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'User not found'}));
    return;
  }

  res.writeHead(200);
  res.end(JSON.stringify(transformedUser));
};

export default update;
