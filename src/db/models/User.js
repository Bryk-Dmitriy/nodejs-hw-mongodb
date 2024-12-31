import { Schema, model } from 'mongoose';

import { handleSaveError, setUpdateSettings } from './hooks.js';
import { emailReg } from '../../constants/userrs.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailReg,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.post('save', handleSaveError);

userSchema.post('findOneAndUpdate', handleSaveError);

userSchema.pre('findOneAndUpdate', setUpdateSettings);

export const userCollection = model('user', userSchema);
