import { Router } from 'express';

import {
  getContactController,
  getContactbyIdController,
  postContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contact.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../utils/validateBody.js';

import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contact.js';

import { isValidId } from '../middlewares/isValidId.js';

import { authenticate } from '../middlewares/authenticate.js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', ctrlWrapper(getContactController));

contactRouter.get('/:id', isValidId, ctrlWrapper(getContactbyIdController));

contactRouter.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(postContactController),
);

contactRouter.patch(
  '/:id',
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactController),
);

contactRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default contactRouter;
