const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

class ContactManager {
  constructor(params) {
    this.$addContactButton = params.addContactBtn;
    this.$resultContainer = params.resultContainer;
    this.$search = params.searchInputBox;
    this.$name = params.nameInput;
    this.$email = params.emailInput;
    this.$requiredFields = params.required;
    const helper = {
      isEmpty: (inputField) => !inputField.val().trim(),
      isValid: (inputField, regex) => {
        return regex.test(inputField.val().trim());
      }
    }
    this.params = params;
    this.helper = helper;
  }

  init() {
    this.deleteBtn = "[data-id='deleteButton']";
    this.contactCount = 1;
    this.contacts = [];
    this.filteredContacts = [];

    this.bindEvents();
  }

  bindEvents() {
    this.bindAddContactButtonEvent();
    this.bindDeleteContactEvent();
    this.bindSearchEvent();
  }

  bindAddContactButtonEvent() {
    $(this.$addContactButton).on("click", () => this.handleAddEvent());
  }

  bindDeleteContactEvent() {
    $(this.$resultContainer).on("click", this.deleteBtn, () => this.handleDeleteEvent());
  }

  bindSearchEvent() {
    $(this.$search).on("keyup", () => this.handleSearchEvent());
  }

  handleSearchEvent() {
    this.showFilteredContacts();
  }

  handleAddEvent() {
    this.addContact();
    this.clearData();
    this.showFilteredContacts();
  }

  handleDeleteEvent() {
    let contactId = $(event.target).data('contactId');
    this.deleteContact(contactId);
    this.showFilteredContacts();
  }

  addContact() {
    let contactData = this.validateInfo();
    this.contacts.push(new ContactsModel(contactData));
    this.contactCount++;
  }

  validateInfo() {
    let isValidData = this.validateData(),
        isUniqueEmail = '',
        contactData = '';
    
    if(isValidData) {
      isUniqueEmail = this.validateUniqueEmail();

      if(isUniqueEmail) {
        contactData = {
          id: this.contactCount,
          name: this.contactName,
          email: this.contactEmail,
        };
        return contactData;
      } else {
        alert("Email already is use");
        this.clearData();
      }
    } else {
      alert("Please enter valid data");
    }
  }

  validateData() {
    this.contactName = this.$name.val().trim();
    this.contactEmail = this.$email.val().trim();
    $(this.$requiredFields).each((index, field) => {
      if(this.helper.isEmpty($(field))) {
        return false;
      }
    });
    return this.helper.isValid(this.$email, EMAIL_REGEX)
  }

  validateUniqueEmail() {
    let isUniqueEmail = true;
    $.each(this.contacts, (index, contact) => {
      if(contact.email === this.contactEmail) {
        isUniqueEmail = false;
      }
      return;
    });
    return isUniqueEmail;
  }

  showFilteredContacts() {
    this.filterContacts();
    this.showContactResults();
  }

  showContactResults() {
  this.$resultContainer.empty();

  let documentFragment = document.createDocumentFragment(),
      $contactContainer = '',
      $contactName = '' ,
      $contactEmail = '' ,
      $deleteButton = '' ;

  $.each(this.filteredContacts, function() {
    $contactContainer = $('<div>').addClass('user-data-block');
    $contactName = $('<p>').text("Name: " + this.name);
    $contactEmail = $('<p>').text("Email: " + this.email);
    $deleteButton = $('<button>', {'data-id': "deleteButton", 'data-contact-id': this.id})
                    .text('DELETE')
                    .addClass('delete');

    $contactContainer.append($contactName, $contactEmail, $deleteButton);
    documentFragment.append($contactContainer[0]);
  });
  this.$resultContainer.append(documentFragment);
  }

  clearData() {
    this.$name.val('');
    this.$email.val('');
    this.$search.val('');
  }

  deleteContact(contactId) {
    this.contacts = this.contacts.filter(contact => {
      if(contact.id != contactId) {
        return true;
      }
    });
  }

  filterContacts() {
    this.filteredContacts = [];
    this.searchText = this.$search.val();
    $.each(this.contacts, (index, contact) => {
      if (this.contacts[index].name.indexOf(this.searchText) !== -1) {
        this.filteredContacts.push(contact);
      }
    });
  }
}

(function() {
  var params = {
    userDataBlock : 'user-data-block',
    delBtn : 'delete',
    required : $('.required'),
    nameInput : $('.name'),
    emailInput : $('.email'),
    resultContainer : $('.result-container'),
    addContactBtn : $('#add-btn'),
    searchInputBox : $('#search')
  },
  contactManager = new ContactManager(params);
  contactManager.init();
})();
