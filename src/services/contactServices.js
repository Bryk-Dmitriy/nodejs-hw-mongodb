import { ContactCollection } from '../db/models/Contact.js';

export const getContacts = () => ContactCollection.find();

export const getContactbuId = (id) => ContactCollection.findById(id);
