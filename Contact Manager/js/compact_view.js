class Compact {
  constructor() {
  }

  getContacts() {
    var documentFragment = document.createDocumentFragment();

    let $table = $('<table>'),
        $contactContainer = '',
        $contactInfo = '',
        $deleteButtonContainer = '',
        $deleteButton = '' ;
  
    $.each(DataStorage.filteredContacts, function() {
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
          $contactInfo.css("background","yellow");
          break;
        }
        case "customer": {
          $contactInfo.css("background","lightblue");
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

  getLegends() {
    var documentFragment = document.createDocumentFragment();
    let $employeeLegend = $("<li>", {
      text: " Employee",
    });
    let $employeeSpan = $("<span>", {
      class: "employee",
    });
    let $customerLegend = $("<li>", {
      text: " Customer",
    });
    let $customerSpan = $("<span>", {
      class: "customer",
    });

    $employeeLegend.append($employeeSpan);
    $customerLegend.append($customerSpan);
    documentFragment.append($customerLegend[0], $employeeLegend[0]);
    return documentFragment;
  }
}