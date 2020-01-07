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
    this.$paginationDiv = $(selectors.paginationDiv);
    this.$prevNavigation = $(selectors.prevNavigation);
    this.$nextNavigation = $(selectors.nextNavigation);
    this.$pageEntriesDiv = $(selectors.pageEntriesDiv);
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
      window.location.hash = '';
      this.$viewButtons.removeClass("button-selected");
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
    window.location.hash = '';
  }

  deleteContact(contactId) {
    DataStorage.delete(contactId);
    if(DataStorage.contacts.length == 0) {
      this.$paginationDiv.hide();
      this.$pageEntriesDiv.hide();
    }
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
        this.$gridButton.addClass("button-selected");
        this.setQueryParam({view: "grid"});
        var view = new Grid();
        break;
      }
    }
    var documentFragment = view.getContacts();
    this.$resultContainer.append(documentFragment);
    if(DataStorage.contacts.length >= 1) {
      this.$paginationDiv.show();
      this.$pageEntriesDiv.show();
    }
    this.pagination();
  }

  pagination() {
    this.$paginationDiv.empty();
    this.$entries = this.$resultContainer.children().children();
    let show_per_page = parseInt(this.$entriesPerPage.val(), 10);
    let number_of_items = this.$entries.length;
    let number_of_pages = Math.ceil(number_of_items / show_per_page);

    $('#current_page').val(0);
    $('#show_per_page').val(show_per_page);

    let $prev_navigation = Helper.createAnchorTag({class:"prev", text: "Prev"}, {}, this.goToPreviousPage.bind(this));
    this.$paginationDiv.append($prev_navigation);
    var current_page = 0;
    while (number_of_pages > current_page) {
      let $page = Helper.createAnchorTag({class: "page", text: `${current_page + 1}`}, {longdesc: `${current_page}`}, this.goToPage.bind(this), current_page);
      this.$paginationDiv.append($page);
      current_page++;
    }
    let $next_navigation = Helper.createAnchorTag({class:"next", text: "Next"}, {}, this.goToNextPage.bind(this));
    this.$paginationDiv.append($next_navigation);

    $('.pagination .page:first').addClass('active');
    this.$entries.css('display', 'none');
    this.$entries.slice(0, show_per_page).css('display', 'block');
  }

  goToPage(page_num) {
    let show_per_page = parseInt($('#show_per_page').val(), 0);
    let start_from = page_num * show_per_page;
    let end_on = start_from + show_per_page;
  
    this.$entries.css('display', 'none').slice(start_from, end_on).css('display', 'block');
    $(`[data-longdesc='${page_num}']`).addClass('active').siblings('.active').removeClass('active');
    $('#current_page').val(page_num);
  }

  goToPreviousPage() {
    let new_page = parseInt($('#current_page').val(), 0) - 1;
    if ($('.active').prev('.page').length == true) {
        this.goToPage(new_page);
    }
  }
  
  goToNextPage() {
    let new_page = parseInt($('#current_page').val(), 0) + 1;
    if ($('.active').next('.page').length == true) {
        this.goToPage(new_page);
    }
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
    paginationDiv: '.pagination',
    currentPage: '#currentPage',
    pageEntriesDiv: ".pageEntries",
    entriesPerPage: '[data-entries]',
  },
  contactManager = new ContactManager(selectors);
  contactManager.init();
})();
