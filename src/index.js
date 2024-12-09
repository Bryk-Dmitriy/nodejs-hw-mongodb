import { initMongoDB } from './db/initMongoDB.js';
import { setupServer } from './server.js';

const boostrap = async () => {
  await initMongoDB();
  setupServer();
};

boostrap();
