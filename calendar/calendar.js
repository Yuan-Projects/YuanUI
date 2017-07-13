function Calendar(options) {
  this.inputElement = options.inputElement;
  var that = this;

  insertToDOM();

  function createRootElement() {
    var tag = Calendar.utils.tag;
    var rootElement = tag('div', {
      className: 'yuanui-calendar'
    });

    var headerTable = tag('table');
    var headerTableTr = tag('tr');
    var headerTableTd1 = tag('td'),
        headerTableTd2 = tag('td'),
        headerTableTd3 = tag('td');

    var todayObject = Calendar.utils.getToday();
    headerTableTd1.className = 'rangeIndicator';
    headerTableTd1.innerHTML = todayObject.year + '年' + todayObject.month + '月';

    headerTableTd2.innerHTML = '&uarr;';
    headerTableTd3.innerHTML = '&darr;';

    headerTableTr.appendChild(headerTableTd1);
    headerTableTr.appendChild(headerTableTd2);
    headerTableTr.appendChild(headerTableTd3);

    headerTable.appendChild(headerTableTr);

    var dateTable = tag('table'),
        dateTableThead = tag('thead'),
        dateTableTbody = tag('tbody'),
        dateTableTheadTr = tag('tr');

    var dateTableTr, dateTableTd;

    dateTableTheadTr.innerHTML = '<th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th>';
    dateTable.appendChild(dateTableThead);
    dateTable.appendChild(dateTableTbody);

    dateTableThead.appendChild(dateTableTheadTr);


    for (var i = 0; i < 6; i++) {
      dateTableTr = tag('tr');
      for (var j = 6 ; j >= 0; j--) {
        dateTableTd = tag('td');
        dateTableTr.appendChild(dateTableTd);
      }
      dateTableTbody.appendChild(dateTableTr);
    }

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
  },
  tag: function(tagName, options) {
    var element = document.createElement(tagName);
    if (options && Object.prototype.toString.call(options) === "[object Object]") {
      for (var prop in options) {
        element[prop] = options[prop];
      }
    }
    return element;
  }
};