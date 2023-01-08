import http from 'http';

import { User } from "../types";

const validateUser = (user: User,  res: http.ServerResponse): User => {
  const throwNotFoundError = () => {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "User not found" }));
  };

  if (!user.id || typeof user.id !== "string") {
    throwNotFoundError();
  }
  if (!user.username || typeof user.username !== "string") {
       throwNotFoundError();
  }
  if (!user.age || typeof user.age !== "number") {
       throwNotFoundError();
  }
  if (!user.hobbies || !Array.isArray(user.hobbies)) {
       throwNotFoundError();
  }

  return user;
}