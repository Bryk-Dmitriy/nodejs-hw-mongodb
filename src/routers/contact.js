import { Router } from 'express';

import {
  getContactController,
  getContactbyIdController,
  postContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contact.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(getContactController));

contactRouter.get('/:id', ctrlWrapper(getContactbyIdController));

contactRouter.post('/', ctrlWrapper(postContactController));

contactRouter.patch('/:id', ctrlWrapper(patchContactController));

contactRouter.delete('/:id', ctrlWrapper(deleteContactController));

export default contactRouter;
