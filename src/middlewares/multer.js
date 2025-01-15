import multer from 'multer';

import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createError from 'http-errors';

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: (req, file, cb) => {
    const prefix = `${Date.now()}`;
    const fileName = `${prefix}_${file.originalname}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const extention = file.originalname.split('.').pop();
  if (extention === 'exe') {
    return cb(createError(400, '.exe file is not available'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
});
