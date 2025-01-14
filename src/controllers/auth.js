import {
  login,
  register,
  refreshTokenService,
  logoutService,
  sendResetPassword,
  resetPassword,
} from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerCtrl = async (req, res) => {
  const newUser = await register(req.body);

  const { password, ...data } = newUser.toObject();

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};

export const loginCtrl = async (req, res) => {
  const session = await login(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshCtrl = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await refreshTokenService({
    refreshToken,
    sessionId,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refresh session',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutCtrl = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutService(req.cookies.sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const sendResetPasswordCtrl = async (req, res, next) => {
  try {
    await sendResetPassword(req.body.email);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordCtrl = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPassword(token, password);
    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
