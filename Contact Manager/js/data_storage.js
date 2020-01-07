class DataStorage {
  constructor() {
  }
  static contacts = [];
  static filteredContacts = [];
  static filteredLocalStorage = [];
  static contactsLocalStorage = [];

  static add(contactData) {
    DataStorage.contacts.push(new Contact(contactData));
    localStorage.setItem("contacts", JSON.stringify(DataStorage.contacts));
  }

  static delete(contactId) {
    DataStorage.contacts = DataStorage.contacts.filter(contact => {
      if(contact.id != contactId) {
        return true;
      }
    });
  }

  static filter(searchText, filterTypeOption) {
    DataStorage.filteredContacts = [];
    
    $.each(DataStorage.contacts, (index, contact) => {
      if (contact.name.indexOf(searchText) !== -1 &&  contact.type.indexOf(filterTypeOption) !== -1) {
        DataStorage.filteredContacts.push(contact);
      }
    });
  }
}

