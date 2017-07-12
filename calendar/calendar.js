function Calendar(options) {
  this.inputElement = options.inputElement;
  var that = this;

  insertToDOM();

  function createRootElement() {
    var rootElement = document.createElement('div');

    var headerTable = document.createElement('table');
    var headerTableTr = document.createElement('tr');
    var headerTableTd1 = document.createElement('td'),
        headerTableTd2 = document.createElement('td'),
        headerTableTd3 = document.createElement('td');

    var todayObject = Calendar.utils.getToday();
    headerTableTd1.className = 'rangeIndicator';
    headerTableTd1.innerHTML = todayObject.year + '年' + todayObject.month + '月';

    headerTableTd2.innerHTML = '&uarr;';
    headerTableTd3.innerHTML = '&darr;';

    headerTableTr.appendChild(headerTableTd1);
    headerTableTr.appendChild(headerTableTd2);
    headerTableTr.appendChild(headerTableTd3);

    headerTable.appendChild(headerTableTr);

    var dateTable = document.createElement('table'),
        dateTableThead = document.createElement('tr');

    dateTableThead.innerHTML = '<td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td>';

    dateTable.appendChild(dateTableThead);



    rootElement.appendChild(headerTable);
    rootElement.appendChild(dateTable);
    return rootElement;
  }

  function insertToDOM() {
    var rootElement = createRootElement();
    Calendar.utils.insertAfter(rootElement, that.inputElement);
  }
}

Calendar.utils = {
  insertAfter: function(newElement, targetElement) {
    targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
  },
  getToday: function() {
    var today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    }
  }
};