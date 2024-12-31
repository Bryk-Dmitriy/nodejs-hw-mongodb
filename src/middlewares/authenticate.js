import createError from 'http-errors';

import { getSession, getUser } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createError(401, 'Access token expired'));
  }
  const [bearer, accessToken] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    return next(createError(401, 'Bearer not found'));
  }
  const session = await getSession({ accessToken });
  if (!session) {
    if (Date.now() > session?.accessTokenValidUntil) {
      return next(createError(401, 'Access token expired'));
    }
    return next(createError(401, 'Session not found'));
  }

  const user = await getUser({ _id: session.userId });
  if (!user) {
    return next(createError(401, 'User not found'));
  }
  req.user = user;
  next();
};
