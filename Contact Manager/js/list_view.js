class List {
  constructor() {
  }

  getContacts() {
    let documentFragment = document.createDocumentFragment(),
      $list = $('<table>'),
      $contactContainer = '',
      $contactName = '',
      $contactEmail = '',
      $contactType = '',
      $deleteButtonContainer = '',
      $deleteButton = '' ;

    $.each(DataStorage.filteredContacts, function() {
      $contactContainer = $('<tr>');
      $contactName = $('<td>').text(this.name).addClass('listElement');
      $contactEmail = $('<td>').text(this.email).addClass('listElement');
      $contactType = $('<td>').text(this.type).addClass('listElement');
      $deleteButtonContainer = $('<td>').addClass('listElement');
      $deleteButton = $('<button>', {'data-id': "deleteButton", 'data-contact-id': this.id})
                      .text('DELETE')
                      .addClass('delete');

      $deleteButtonContainer.append($deleteButton);
      $contactContainer.append($contactName, $contactEmail, $contactType, $deleteButtonContainer);
      $list.append($contactContainer);
      documentFragment.append($list[0]);
    });
    return documentFragment
  }
}