class Grid {
  constructor(filteredContacts) {
    this.filteredContacts = filteredContacts;
  }

  getContacts() {
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
    return documentFragment;
  }
}