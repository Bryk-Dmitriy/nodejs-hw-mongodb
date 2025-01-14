import { userCollection } from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import { createToken, verifyToken } from '../utils/jwtConfig.js';
import { transporter, FROM_EMAIL } from '../utils/sendEmail.js';

import createError from 'http-errors';

import bcrypt from 'bcrypt';

import { randomBytes } from 'crypto';

import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/userrs.js';

const createSessionData = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifeTime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
});

export const register = async (payload) => {
  const { email, password } = payload;

  const user = await userCollection.findOne({ email });
  if (user) {
    throw createError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await userCollection.create({
    ...payload,
    password: hashPassword,
  });
  return newUser;
};

export const login = async ({ email, password }) => {
  const user = await userCollection.findOne({ email });

  if (!user) {
    throw createError(401, 'Email or password incorrect');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw createError(401, 'Email or password incorrect');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const refreshTokenService = async (payload) => {
  const session = await SessionCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });

  if (!session) {
    throw createError(401, 'Session not found');
  }

  if (Date.now() > session.refreshTokenValidUntil) {
    throw createError(401, 'Refresh token expired');
  }

  await SessionCollection.deleteOne({ _id: payload.sessionId });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: session.userId,
    ...sessionData,
  });
};

export const logoutService = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const getUser = (filter) => userCollection.findOne(filter);

export const getSession = (filter) => SessionCollection.findOne(filter);

export const sendResetPassword = async (email) => {
  const user = await userCollection.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const token = createToken({ email }, '5m');
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
  } catch (error) {
    throw createError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async (token, newPassword) => {
  const payload = verifyToken(token);
  const user = await userCollection.findOne({ email: payload.email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
};
