import { v2 as cloudinary } from 'cloudinary';

import { unlink } from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';

const cloudName = getEnvVar('CLOUNDARY_NAME');
const cloudKey = getEnvVar('CLOUNDARY_API');
const cloudPassword = getEnvVar('CLOUNDARY_PASSWORD');

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudKey,
  api_secret: cloudPassword,
});

export const saveFileToCloudinary = async (file) => {
  const res = await cloudinary.uploader.upload(file.path, {
    folder: 'photo',
  });
  await unlink(file.path);
  return res.secure_url;
};
