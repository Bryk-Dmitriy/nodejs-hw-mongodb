import express from 'express';
import cors from 'cors';

import { getEnvVar } from './utils/getEnvVar.js';

import { logger } from './middlewares/pino.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import contactRouter from './routers/contact.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(logger);

  app.use('/contacts', contactRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = Number(getEnvVar('PORT', 3000));

  app.listen(PORT, () => console.log(`Server running on ${PORT} port`));
};
