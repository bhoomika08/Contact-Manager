const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const helper = {
  isEmpty: (inputField) => !inputField.val(),
  isValid: (inputField, regex) => {
    return regex.test(inputField.val().trim());
  }
};
const errorMessages = {
  isDataFilled: "All fields are required",
  isValidEmail: "Enter valid email",
  isUniqueEmail: "Email already exist",
}

class ContactManager {
  constructor(selectors) {
    this.getDomElements(selectors);
  }

  getDomElements(selectors) {
    this.$addContactButton = $(selectors.addContactBtn);
    this.$resultContainer = $(selectors.resultContainer);
    this.$search = $(selectors.searchInputBox);
    this.$typeFilter = $(selectors.typeFilter);
    this.$gridButton = $(selectors.gridButton);
    this.$listButton = $(selectors.listButton);
    this.$compactButton = $(selectors.compactButton); 
    this.$viewDiv = $(selectors.viewDiv);
    this.$viewButtons = $(selectors.viewButtons);
    this.$legendDiv = $(selectors.legendDiv);
    this.$name = $(selectors.nameInput);
    this.$email = $(selectors.emailInput);
    this.$contactType = $(selectors.contactType);
    this.$prevNavigation = $(selectors.prevNavigation);
    this.$nextNavigation = $(selectors.nextNavigation);
    this.$entriesPerPage = $(selectors.entriesPerPage);
  }

  init() {
    this.contactCount = 1;
    this.bindEvents();
    this.checkLocalStorage();
  }

  checkLocalStorage() {
    if(localStorage.getItem('contacts') !== null) {
      DataStorage.contacts = JSON.parse(localStorage.getItem('contacts'));
      this.showFilteredContacts();
    } else {
      DataStorage.contacts = [];
    }
    this.getQueryParams();
  }

  getQueryParams() {
    let hash = window.location.hash;
    if(hash) {
      let hashParams = JSON.parse(decodeURIComponent(hash.slice(1)));
      this.$search.val(hashParams.search);
      this.view = hashParams.view;
      if(!hashParams.hasOwnProperty("type")) {
        this.$typeFilter.val("type");
      } else {
        this.$typeFilter.val(hashParams.type);
      }
      this.showFilteredContacts();
    } else {
      return;
    }
  }

  setQueryParam(hashParam) {
    let existingHash = window.location.hash;
    if(!existingHash) {
      existingHash = {};
    } else {
      existingHash = JSON.parse(decodeURIComponent(window.location.hash.slice(1)));
    }
    var newHash = {...existingHash, ...hashParam};
    window.location.hash = JSON.stringify(newHash);
  }

  bindEvents() {
    this.bindAddContactButtonEvent();
    this.bindDeleteContactEvent();
    this.bindSearchEvent();
    this.bindFilterEvent();
    this.bindViewButtonsEvent();
    this.bindPaginationEntriesChangeEvent();
  }

  bindAddContactButtonEvent() {
    this.$addContactButton.on("click", () => this.handleAddEvent());
  }

  bindDeleteContactEvent() {
    this.$resultContainer.on("click", "[data-id='deleteButton']", () => this.handleDeleteEvent());
  }

  bindSearchEvent() {
    this.$search.on("keyup", () => this.handleSearchEvent());
  }

  bindFilterEvent() {
    this.$typeFilter.on("change", () => this.handleFilterEvent());
  }

  bindViewButtonsEvent() {
    $(this.$viewButtons).on("click", () => this.handleChangeViewEvent());
  }

  bindPaginationEntriesChangeEvent() {
    this.$entriesPerPage.on("change", () => this.handleEntriesChangeEvent());
  }

  handleSearchEvent() {
    this.setQueryParam({search: `${this.$search.val()}`});
    this.showFilteredContacts();
  }

  handleFilterEvent() {
    this.setQueryParam({type: this.$typeFilter.val()});
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
    this.view = $(event.target).data('view');
    this.setQueryParam({view: `${this.view}`});
    this.showFilteredContacts();
  }

  handleEntriesChangeEvent() {
    this.showFilteredContacts();
  }

  addContact() {
    let error = this.validateInfo();
    let contactData = {};
    if(error == false) {
      contactData = {
        id: this.contactCount,
        name: this.contactName,
        email: this.contactEmail,
        type: this.contactType,
      };
      DataStorage.add(contactData);
      this.contactCount++;
      this.clearData();
      this.showFilteredContacts();
    }
    else {
      alert(error);
    }
  }

  validateInfo() {
    this.contactName = this.$name.val().trim();
    this.contactEmail = this.$email.val().trim();
    this.contactType = this.$contactType.val();
    var error = false;
    if(helper.isEmpty(this.$name)) {
      error = errorMessages.isDataFilled;
      return error;
    }

    if(helper.isEmpty(this.$email)) {
      error = errorMessages.isDataFilled;
      return error;
    } else if(!helper.isValid(this.$email, EMAIL_REGEX)) {
      error = errorMessages.isValidEmail;
      return error;
    } else {
      $.each(DataStorage.contacts, (index, contact) => {
        if(contact.email === this.contactEmail) {
          error = errorMessages.isUniqueEmail;
          this.$email.val('');
          return error;
        }
      });
    }

    if(helper.isEmpty(this.$contactType)) {
      error = errorMessages.isDataFilled;
      return error;
    }
    return error;
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
    DataStorage.delete(contactId);
  }

  filterContacts() {
    this.searchText = this.$search.val();
    this.typeFilterOption = this.$typeFilter.val() == "type" ? "" : this.$typeFilter.val() ;
    DataStorage.filter(this.searchText, this.typeFilterOption);
  }

  showResults() {
    this.$resultContainer.empty();
    this.$legendDiv.empty();
    this.$viewButtons.removeClass("button-selected");
    switch(this.view) {
      case 'list': {
        var view = new List();
        this.$listButton.addClass("button-selected");
        break;
      }
      case 'compact': {
        var view = new Compact();
        this.$compactButton.addClass("button-selected");
        let $legends = view.getLegends();
        this.$legendDiv.append($legends);
        break;
      }
      default: {
        if(DataStorage.contacts.length >= 1) {
          this.$gridButton.addClass("button-selected");
        }
        var view = new Grid();
        break;
      }
    }
    var documentFragment = view.getContacts();
    this.$resultContainer.append(documentFragment);
    if(DataStorage.contacts.length >= 1) {
      $(".pagination").show();
    }
    this.pagination();
  }

  pagination() {
    let entriesPerPage = parseInt(this.$entriesPerPage.val(), 10); 
    let $entries = this.$resultContainer.children().children();
    $entries.filter(`:gt(${entriesPerPage - 1})`).hide();
    $entries.filter(`:lt(${entriesPerPage})`).addClass('active');

    this.$nextNavigation.click(() => {
      let index = $entries.index($entries.filter('.active:last')) || 0;
      let $toHighlight = $entries.slice(index + 1, index + (entriesPerPage + 1));
      if ($toHighlight.length == 0) {
        return;
      }
      $entries.filter('.active').removeClass('active').hide();
      $toHighlight.show().addClass('active')
    });
    
    this.$prevNavigation.click(() => {
      let index = $entries.index($entries.filter('.active:first')) || 0;

      let start = index < (entriesPerPage - 1) ? 0 : index - entriesPerPage;
      let $toHighlight = $entries.slice(start, start + entriesPerPage);
      if ($toHighlight.length == 0) {
        return;
      }      
      $entries.filter('.active').removeClass('active').hide();
      $toHighlight.show().addClass('active')
    });
  }
}

(function() {
  var selectors = {
    required: '.required',
    nameInput: '.name',
    emailInput: '.email',
    contactType: '.type',
    resultContainer: '.result-container',
    addContactBtn: '#add-btn',
    searchInputBox: '#search',
    typeFilter: "#typeFilter",
    viewDiv: ".view-div",
    viewButtons: '.view',
    legendDiv: '.legend',
    gridButton : '#grid',
    listButton: '#list',
    compactButton: '#compact',
    prevNavigation: '#prev',
    nextNavigation: '#next',
    entriesPerPage: '[data-entries]',
  },
  contactManager = new ContactManager(selectors);
  contactManager.init();
})();
