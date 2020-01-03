const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const helper = {
  isEmpty: (inputField) => !inputField.val(),
  isValid: (inputField, regex) => {
    return regex.test(inputField.val().trim());
  }
};

class ContactManager {
  constructor(params) {
    this.$addContactButton = params.addContactBtn;
    this.$resultContainer = params.resultContainer;
    this.$search = params.searchInputBox;
    this.$gridButton = params.gridButton;
    this.$viewButtons = params.viewButtons;
    this.$name = params.nameInput;
    this.$email = params.emailInput;
    this.$contactType = params.contactType;
    this.$requiredFields = params.required;
    this.params = params;
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
    this.bindViewButtonsEvent();
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

  bindViewButtonsEvent() {
    $(this.$viewButtons).on("click",() => this.handleChangeViewEvent());
  }

  handleSearchEvent() {
    this.showFilteredContacts();
  }

  handleAddEvent() {
    this.addContact();
  }

  handleDeleteEvent() {
    let contactId = $(event.target).data('contactId');
    this.deleteContact(contactId);
    this.showFilteredContacts();
  }

  handleChangeViewEvent() {
    this.view = $(event.target).data('id');
    this.$viewButtons.removeClass("button-selected");
    $(event.target).addClass("button-selected");
    this.showFilteredContacts();
  }

  addContact() {
    let isValid = this.validateInfo();
    if(isValid) {
      this.showFilteredContacts();
    }
  }

  validateInfo() {
    let isDataFilled = this.validateData(),
        isValidEmail = '',
        contactData = '',
        isUniqueEmail = '';
    
    if(isDataFilled) {
      isValidEmail = this.validateEmail();

      if(isValidEmail) {
        isUniqueEmail = this.isEmailUnique();

        if(isUniqueEmail) {
          contactData = {
            id: this.contactCount,
            name: this.contactName,
            email: this.contactEmail,
            type: this.contactType,
          };
          this.contacts.push(new Contact(contactData));
          this.contactCount++;
          this.clearData();
        } else {
          alert("Email already is use");
          return false;
        }
      } else {
        alert("Enter valid email");
        return false;
      }
    } else {
      alert("All fields are required.");
      return false;
    }
    return true;
  }

  validateData() {
    this.contactName = this.$name.val().trim();
    this.contactEmail = this.$email.val().trim();
    this.contactType = this.$contactType.val();
    let isDataFilled = true;
    $(this.$requiredFields).each((index, field) => {
      if(helper.isEmpty($(field))) {
        isDataFilled = false;
        return;
      }
    });
    return isDataFilled;
  }

  validateEmail() {
    let isValidEmail = true;
    if(!helper.isValid(this.$email, EMAIL_REGEX)) {
       isValidEmail = false;
    }
    return isValidEmail;
  }

  isEmailUnique() {
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
    this.showResults();
  }

  clearData() {
    this.$name.val('');
    this.$email.val('');
    this.$search.val('');
    this.$contactType.find('option:first').prop('selected', true);
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
      if (contact.name.indexOf(this.searchText) !== -1) {
        this.filteredContacts.push(contact);
      }
    });
  }

  showResults() {
    this.$resultContainer.empty();
    switch(this.view) {
      case 'list': {
        var view = new List(this.filteredContacts);
        break;
      }
      case 'compact': {
        var view = new Compact(this.filteredContacts);
        break;
      }
      default: {
        this.$gridButton.addClass("button-selected");
        var view = new Grid(this.filteredContacts);
        break;
      }
    }
    var documentFragment = view.getContacts();
    this.$resultContainer.append(documentFragment);
  }
}

(function() {
  var params = {
    userDataBlock: 'user-data-block',
    delBtn: 'delete',
    required: $('.required'),
    nameInput: $('.name'),
    emailInput: $('.email'),
    contactType: $('.type'),
    resultContainer: $('.result-container'),
    addContactBtn: $('#add-btn'),
    searchInputBox: $('#search'),
    viewButtons: $('.view'),
    gridButton : $('#grid'),
  },
  contactManager = new ContactManager(params);
  contactManager.init();
})();
