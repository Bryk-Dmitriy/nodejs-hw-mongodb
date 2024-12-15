import { ContactCollection } from '../db/models/Contact.js';

export const getContacts = () => ContactCollection.find();

export const getContactbuId = (id) => ContactCollection.findById(id);

export const addContact = (data) => ContactCollection.create(data);

export const cheangeContact = async (_id, data) => {
  const result = await ContactCollection.findOneAndUpdate({ _id }, data, {
    new: true,
  });

  if (!result) return null;
  return { data: result };
};

export const deleteContact = (id) => ContactCollection.findOneAndDelete(id);
