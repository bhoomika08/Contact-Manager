class Grid {
  constructor() {
  }

  getContacts() {
    let documentFragment = document.createDocumentFragment(),
        $grid = $("<div>"),
        $contactContainer = '',
        $contactName = '' ,
        $contactEmail = '' ,
        $contactType = '',
        $deleteButton = '' ;

    $.each(DataStorage.filteredContacts, function() {
      $contactContainer = $('<div>').addClass('user-data-block');
      $contactName = $('<p>').text("Name: " + this.name);
      $contactEmail = $('<p>').text("Email: " + this.email);
      $contactType = $('<p>').text("Type: " + this.type);
      $deleteButton = $('<button>', {'data-id': "deleteButton", 'data-contact-id': this.id})
                      .text('DELETE')
                      .addClass('delete');
  
      $contactContainer.append($contactName, $contactEmail, $contactType, $deleteButton);
      $grid.append($contactContainer);
      documentFragment.append($grid[0]);
    });
    return documentFragment;
  }
}