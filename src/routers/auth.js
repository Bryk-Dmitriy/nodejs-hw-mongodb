import { Router } from 'express';

import { validateBody } from '../utils/validateBody.js';

import {
  authloginSchema,
  authRegisterSchema,
  sendResetPasswordSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  loginCtrl,
  refreshCtrl,
  registerCtrl,
  logoutCtrl,
  resetPasswordCtrl,
  sendResetPasswordCtrl,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(registerCtrl),
);

authRouter.post(
  '/login',
  validateBody(authloginSchema),
  ctrlWrapper(loginCtrl),
);

authRouter.post('/refresh', ctrlWrapper(refreshCtrl));

authRouter.post('/logout', ctrlWrapper(logoutCtrl));

authRouter.post(
  '/send-reset-email',
  validateBody(sendResetPasswordSchema),
  sendResetPasswordCtrl,
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  resetPasswordCtrl,
);

export default authRouter;
