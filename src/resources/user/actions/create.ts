import { IncomingMessage, ServerResponse } from 'http';

import { parseBody } from '../../../helpers/parseBody';
import userService from '../user.service';
import { validateUser } from './../user.helpers';

const create = async (req: IncomingMessage, res: ServerResponse) => {
  const user = await parseBody(req);

  const isValid = validateUser(user, res);
  if (!isValid) {
    return;
  }

  userService.create(user);

  res.writeHead(201);
  res.end(JSON.stringify(user));
};

export default create;
