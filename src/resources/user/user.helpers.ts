import { ServerResponse } from 'http';
import * as uuid from 'uuid';

import { User } from './user.types';

export const validateUser = (user: User, res: ServerResponse) => {
  const throwValidationError = (): User | null => {
    res.writeHead(400);
    res.end(JSON.stringify({ message: 'User is invalid' }));

    return null;
  };

  if (!user.username || typeof user.username !== 'string') {
    return throwValidationError();
  }
  if (!user.age || typeof user.age !== 'number') {
    return throwValidationError();
  }
  if (!user.hobbies || !Array.isArray(user.hobbies)) {
    return throwValidationError();
  }

  return user;
};

export const validateUserId = (id: string, res: ServerResponse) => {
  if (!uuid.validate(id)) {
    res.writeHead(400);
    res.end(JSON.stringify({ message: 'User id is invalid' }));

    return null;
  }

  return id;
};
