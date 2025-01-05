import { ContactCollection } from '../db/models/Contact.js';

import { countPagination } from '../utils/countPagination.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filterSettings = {},
}) => {
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const limit = perPage;
  const skip = (page - 1) * limit;

  if (filterSettings.userId) {
    ContactCollection.find().where('userId').equals(filterSettings.userId);
  }

  const items = await ContactCollection.find(filterSettings)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await ContactCollection.countDocuments(filterSettings);

  const paginationData = countPagination({ total, page, perPage });
  return {
    items,
    total,
    ...paginationData,
  };
};
export const getContactbuId = (id) => ContactCollection.findById(id);

export const getContact = (filter) => ContactCollection.findOne(filter);

export const addContact = (data) => ContactCollection.create(data);

export const cheangeContact = async (filter, data) => {
  const result = await ContactCollection.findOneAndUpdate(filter, data);

  if (!result) return null;
  return { data: result };
};

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
