class List {
  constructor(filteredContacts) {
    this.filteredContacts = filteredContacts;
  }

  getContacts() {
    let documentFragment = document.createDocumentFragment(),
      $list = $('<table>'),
      $contactContainer = '',
      $contactName = '',
      $contactEmail = '',
      $deleteButtonContainer = '',
      $deleteButton = '' ;

    $.each(this.filteredContacts, function() {
      $contactContainer = $('<tr>');
      $contactName = $('<td>').text(this.name).addClass('listElement');
      $contactEmail = $('<td>').text(this.email).addClass('listElement');
      $deleteButtonContainer = $('<td>').addClass('listElement');
      $deleteButton = $('<button>', {'data-id': "deleteButton", 'data-contact-id': this.id})
                      .text('DELETE')
                      .addClass('delete');

      $deleteButtonContainer.append($deleteButton);
      $contactContainer.append($contactName, $contactEmail, $deleteButtonContainer);
      $list.append($contactContainer);
      documentFragment.append($list[0]);
    });
    return documentFragment
  }
}