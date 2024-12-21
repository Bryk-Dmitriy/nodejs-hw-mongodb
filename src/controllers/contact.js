import createError from 'http-errors';

import {
  getContactbuId,
  getContacts,
  addContact,
  cheangeContact,
  deleteContact,
} from '../services/contactServices.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';

import { sortParams } from '../utils/sortParams.js';

import { filter } from '../utils/filter.js';

export const getContactController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = sortParams(req.query);

  const filterSettings = filter(req.query);

  const data = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filterSettings,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
};

export const getContactbyIdController = async (req, res) => {
  const { id } = req.params;
  const data = await getContactbuId(id);
  if (!data) {
    throw createError(404, `Contact with id${id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: data,
  });
};

export const postContactController = async (req, res) => {
  const data = await addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const result = await cheangeContact(id, req.body);

  if (!result) {
    throw createError(404, `Contact with id${id} not found`);
  }

  const { data } = result;

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const result = await deleteContact({ _id: id });

  if (!result) {
    throw createError(404, `Contact with id${id} not found`);
  }

  res.status(204).send();
};
