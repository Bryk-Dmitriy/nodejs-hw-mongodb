import { Schema, model } from 'mongoose';

import { typeList } from '../../constants/contactConst.js';

import { handleSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 20 },
    phoneNumber: { type: String, required: true, minlength: 3, maxlength: 20 },
    email: String,
    isFavourite: { type: Boolean, default: false, required: true },
    contactType: {
      type: String,
      enum: typeList,
      required: true,
      default: 'personal',
      minlength: 3,
      maxlength: 20,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    photo: String,
  },
  { timestamps: true, versionKey: false },
);

contactSchema.post('save', handleSaveError);

contactSchema.post('findOneAndUpdate', handleSaveError);

contactSchema.pre('findOneAndUpdate', setUpdateSettings);

export const ContactCollection = model('contacts', contactSchema);
