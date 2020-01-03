class Compact {
  constructor(filteredContacts) {
    this.filteredContacts = filteredContacts;
  }

  getContacts() {
    let documentFragment = document.createDocumentFragment(),
      $table = $('<table>'),
      $contactContainer = '',
      $contactInfo = '',
      $deleteButtonContainer = '',
      $deleteButton = '' ;
  
    $.each(this.filteredContacts, function() {
      $contactContainer = $('<tr>');
      $contactInfo = $('<td>').text(this.name).hover(() => {
        $(event.target).text(this.email);
      }, () => {
        $(event.target).text(this.name);
      });
      $deleteButtonContainer = $('<td>');
      $deleteButton = $('<button>', {'data-id': "deleteButton", 'data-contact-id': this.id})
                      .text('DELETE')
                      .addClass('delete');
      
      switch(this.type) {
        case "employee": {
          $contactInfo.css("background","lightblue");
          break;
        }
        case "customer": {
          $contactInfo.css("background","yellow");
          break;
        }
      }

      $deleteButtonContainer.append($deleteButton);
      $contactContainer.append($contactInfo, $deleteButtonContainer);
      $table.append($contactContainer);
      documentFragment.append($table[0]);
    });
    return documentFragment;
  }
}