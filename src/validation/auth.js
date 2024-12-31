import Joi from 'joi';
import { emailReg } from '../constants/userrs.js';

export const authRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailReg).required(),
  password: Joi.string().required(),
});

export const authloginSchema = Joi.object({
  email: Joi.string().pattern(emailReg).required(),
  password: Joi.string().required(),
});
