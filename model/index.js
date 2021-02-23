const fs = require("fs/promises");
const { v4: uuid } = require("uuid");
const path = require("path");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) {
      console.log("Error:", err);
      return;
    }
    return data;
  });
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    return contacts.find((c) => c.id === contactId);
  } catch (err) {
    console.log(err);
  }
};
const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const newContacts = contacts.filter((c) => c.id !== contactId);
    fs.writeFile(contactsPath, JSON.stringify(newContacts));
  } catch (err) {
    console.log(err);
  }
};

const addContact = async (body) => {
  const id = uuid();
  try {
    const contacts = await listContacts();
    contacts.push({
      ...body,
      id,
    });
    fs.writeFile(contactsPath, JSON.stringify(contacts));
  } catch (err) {
    console.log(err);
  }
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  let newContact = {};

  const newContacts = contacts.map((contact) => {
    if (contact.id.toString() === contactId) {
      newContact = {
        ...contact,
        ...body,
      };

      return newContact;
    } else {
      return contact;
    }
  });

  await fs.writeFile(contactsPath, JSON.stringify(newContacts), (err) =>
    console.log(err)
  );

  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
