import createError from 'http-errors';

import {
  getContacts,
  addContact,
  cheangeContact,
  deleteContact,
  getContact,
} from '../services/contactServices.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';

import { sortParams } from '../utils/sortParams.js';

import { filter } from '../utils/filter.js';

export const getContactController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = sortParams(req.query);

  const filterSettings = filter(req.query);

  filterSettings.userId = req.user._id;

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
  const { _id: userId } = req.user;
  const { id: _id } = req.params;
  const data = await getContact({ _id, userId });
  if (!data) {
    throw createError(404, `Contact with id${_id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${_id}!`,
    data: data,
  });
};

export const postContactController = async (req, res) => {
  const { _id: userId } = req.user;

  const data = await addContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: data,
  });
};

export const patchContactController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;
  const result = await cheangeContact({ _id, userId }, req.body);

  if (!result) {
    throw createError(404, `Contact with id${_id} not found`);
  }

  const { data } = result;

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;
  const result = await deleteContact({ _id, userId });

  if (!result) {
    throw createError(404, `Contact with id${_id} not found`);
  }

  res.status(204).send();
};
