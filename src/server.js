import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { getEnvVar } from './utils/getEnvVar.js';

import { getContactbuId, getContacts } from './services/contactServices.js';

export const setupServer = () => {
  const app = express();

  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  });

  app.use(cors());
  app.use(express.json());
  app.use(logger);

  app.get('/contacts', async (req, res) => {
    const data = await getContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts',
      data: data,
    });
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const data = await getContactbuId(id);
    if (!data) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: data,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: `${req.url} not found`,
    });
  });

  const PORT = Number(getEnvVar('PORT', 3000));

  app.listen(PORT, () => console.log(`Server running on ${PORT} port`));
};
