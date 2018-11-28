function Calendar(options) {
  var now = new Date();
  var rootElement = null;
  var elementHandlers = [];
  
  this.inputElement = options.inputElement;
  this.headerTable = null;
  this.dateTableElement = null;
  this.options = options;
  this.year = options.year || now.getFullYear();
  this.month = options.month || (now.getMonth() + 1);
  var that = this;

  this.getHandlers = function() {
    return elementHandlers;
  };
  this.getRootElement = function() {
    return rootElement;
  };

  function createRootElement() {
    var tag = Calendar.utils.dom.tag;
    rootElement = tag('div', {
      className: 'yuanui-calendar'
    });

    var headerTable = tag('table');
    var headerTableTr = tag('tr');
    var headerTableTd1 = tag('td'),
        headerTableTd2 = tag('td'),
        headerTableTd3 = tag('td');

    var todayObject = Calendar.utils.date.getToday();
    headerTableTd1.className = 'rangeIndicator';
    headerTableTd1.innerHTML = todayObject.year + '年' + todayObject.month + '月';

    headerTableTd2.className = "uparrow";
    headerTableTd3.className = "downarrow";
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

    that.headerTable = headerTable;
    that.dateTableElement = dateTable;
    return rootElement;
  }
  
  createRootElement();
  this.addEventListeners(); 
}

Calendar.prototype.addEventListeners = function() {
  var that = this;
  var focusHandler = function(e) {
    that.insertToDOM();
    that.setCalendarPosition();
    that.renderDatesInTable(that.year, that.month);
  };
  var blurHandler = function(e) {
    that.removeRootElement();
  };
  var clickHandler = function(e) {
    var target = e.target;
    if (target.classList.contains('uparrow')) {
      that.month--;
      that.normalizeYearMonth();
      that.renderDatesInTable(that.year, that.month);
      that.renderHeaderTableDate();
    } else if (target.classList.contains('downarrow')) {
      that.month++;
      that.normalizeYearMonth();
      that.renderDatesInTable(that.year, that.month);
      that.renderHeaderTableDate();
    }
  };
  this.addEventListener(this.options.inputElement, "focus", focusHandler);
  this.addEventListener(this.options.inputElement, "blur", blurHandler);
  this.addEventListener(this.headerTable, "click", clickHandler);
  
  this.addEventListener(this.dateTableElement, "click", function(e) {
    var target = e.target;
    var targetDate = null;
    if (target.tagName === "TD" && target.getAttribute('data-date')) {
      targetDate = JSON.parse(target.getAttribute('data-date'));
      that.inputElement.value = "" + targetDate.year + "-" + Calendar.utils.msc.padStartZero(targetDate.month) + "-" + Calendar.utils.msc.padStartZero(targetDate.date);
    }
  });
};

Calendar.prototype.insertToDOM = function() {
  Calendar.utils.dom.insertAfter(this.getRootElement(), this.inputElement);
};

Calendar.prototype.removeRootElement = function() {
  Calendar.utils.dom.remove(this.getRootElement());
};

Calendar.prototype.setCalendarPosition = function() {
  var pos = Calendar.utils.dom.offset(this.options.inputElement);
  this.getRootElement().style.left = "" + pos.left + "px";
};

Calendar.prototype.addEventListener = function(el, type, listener) {
  var handlers = this.getHandlers();
  el.addEventListener(type, listener, false);
  handlers.push({
    "el": el,
    "tp": type,
    "cb": listener
  });
};

Calendar.prototype.renderDatesInTable = function(year, month) {
  var that = this;
  var tds = this.dateTableElement.querySelectorAll('td');
  var now = new Date();
  
  var monthInfo = Calendar.utils.date.getCalendarDaysInMonth(year, month);
  monthInfo.forEach(function(currentValue, index, array) {
    var cls = "";
    if (currentValue.year === now.getFullYear() && currentValue.month === (now.getMonth() + 1) && currentValue.date === now.getDate()) {
      cls = "currentDate";
    } else if (currentValue.year === that.year && currentValue.month === that.month) {
      cls = "currentMonth";
    }
    tds[index].setAttribute('data-date', JSON.stringify(currentValue));
    tds[index].className = cls;
    tds[index].innerHTML = currentValue.date;
  });
};

Calendar.prototype.renderHeaderTableDate = function() {
  this.headerTable.querySelector('.rangeIndicator').innerHTML = String(this.year) + "年" + String(this.month) + "月";
};

Calendar.prototype.normalizeYearMonth = function() {
  var date = new Date(this.year, this.month - 1);
  this.year = date.getFullYear();
  this.month = date.getMonth() + 1;
};

Calendar.prototype.dispose = function() {
  var handlers = this.getHandlers();
  var len = handlers.length;
  if (len === 0) return ;
  for (var i = 0; i < len; i++ ) {
    var obj = handlers[i];
    obj["el"].removeEventListener(obj["tp"], obj["cb"], false);
  }
  handlers.length = 0;
  Calendar.utils.dom.remove(this.getRootElement(), true);
};

Calendar.utils = {
  msc: {
    padStartZero: function(number) {
      if (number > 9) return number;
      if (String.prototype.padStart) {
        return String.prototype.padStart.call(number, 2, '0');
      } else {
        return '0' + number;
      }
    }
  },
  dom: {
    offset: function(element) {
      var rect = element.getBoundingClientRect();
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    },
    remove: function(element, destroy) {
      element.parentNode.removeChild(element);
      if (destroy) {
        element = null;
      }
    },
    insertAfter: function(newElement, targetElement) {
      targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
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
  },
  date: {
    /**
     * Returns all calendars days in a specific month.
     * @param {number} year - The value representing the year.
     * @param {number} month - The value representing the month, beginning with 1 for January to 12 for December.
     * @return {Array} An array represents all calendar days in a month.
     */
    getCalendarDaysInMonth: function(year, month) {
      var result = [];
      var thisMonthInfo = Calendar.utils.date.monthInfo(year, month);
      var firstDayOfWeek = thisMonthInfo.firstDayOfWeek;
      var lastShiftDays = firstDayOfWeek > 1 ? (firstDayOfWeek -1) : (firstDayOfWeek + 7 - 1);
      
      var lastMonth = new Date(year, month - 2, 1);
      
      result = result.concat(Calendar.utils.date.getLastDatesOfMonth(lastMonth.getFullYear(), lastMonth.getMonth() + 1, lastShiftDays));
      for (var i = 1, len = thisMonthInfo.days; i <= len; i++) {
        result.push(Calendar.utils.date.dayInfo(year, month, i));
      }
      for (var j = 1, len1 = 42 - thisMonthInfo.days - lastShiftDays; j <= len1; j++) {
        result.push(Calendar.utils.date.dayInfo(year, month+1, j));
      }
      return result;
    },
    /**
     * Returns the last few days in a specific month.
     * @param {number} year - The value representing the year.
     * @param {number} month - The value representing the month, beginning with 1 for January to 12 for December.
     * @param {number} count - The number of days to be counted.
     * @return {Array} An array represents last days in a month.
     *
     */
    getLastDatesOfMonth: function(year, month, count) {
      var result = [];
      var thisMonthInfo = Calendar.utils.date.monthInfo(year, month);
      while(count--) {
        var m = count % 7;
        result.push(Object.assign({}, thisMonthInfo.lastDay, {
          date: thisMonthInfo.lastDay.date - count,
          day: (thisMonthInfo.lastDay.day + 7 - m)%7
        }));
      }
      return result;
    },
    /**
     * Returns an object presenting a specific month.
     * @param {number} year - The value representing the year.
     * @param {number} month - The value representing the month, beginning with 1 for January to 12 for December.
     * @return {Object} An Object presenting a specific month.
     *
     */
    monthInfo: function(year, month) {
      var firstDay = Calendar.utils.date.getFirstDayOfMonth(year, month);
      var lastDay = Calendar.utils.date.getLastDayOfMonth(year, month)
      return {
        days: lastDay.date, // How many days in this month
        firstDay: firstDay,
        lastDay: lastDay,
        firstDayOfWeek: firstDay.day,
        lastDayOfWeek: lastDay.day
      }
    },
    /**
     * Returns the date information of today.
     * @return {Object} The date information.
     */
    getToday: function() {
      return Calendar.utils.date.dayInfo();
    },
    /**
     * Returns the first day in a specific month.
     * @param {number} year - The value representing the year.
     * @param {number} month - The value representing the month, beginning with 1 for January to 12 for December.
     * @return {Object} An Object presenting the first day.
     *
     */
    getFirstDayOfMonth: function(year, month) {
      if (typeof year !== "number" || typeof month !== "number") {
        throw new Error('year and month must be numbers');
      }
      return Calendar.utils.date.dayInfo(year, month, 1);
    },
    /**
     * Returns the last day in a specific month.
     * @param {number} year - The value representing the year.
     * @param {number} month - The value representing the month, beginning with 1 for January to 12 for December.
     * @return {Object} An Object presenting the last day.
     *
     */
    getLastDayOfMonth: function(year, month) {
      if (typeof year !== "number" || typeof month !== "number") {
        throw new Error('year and month must be numbers');
      }
      var d = new Date(year, month);
      d.setDate(d.getDate() - 1);
      return Calendar.utils.date.dayInfo(d);
    },
    /**
     * Returns an object represents a specific date. especialy the day of the week (0-6) for the specified date according to local time.
     * @param {*} [year] - The value representing the year.
     * @param {number} [month] - The value representing the month, beginning with 1 for January to 12 for December.
     * @param {*} [year] - The value representing the day of the month.
     * @return {Object} An object represents a specific date.
     * @example 
     * // eg:
     * {
     *   year: 2018,
     *   month: 11,
     *   date: 30,
     *   day: 5
     * }
     */
    dayInfo: function(year, month, date) {
      var d;
      if (year instanceof Date) {
        d = year;
      } else if (typeof year === "number" && typeof month === "number" && typeof date === "number") {
        d = new Date(year, month - 1, date);
      } else {
        d = new Date();
      }
      var day = d.getDay();
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        date: d.getDate(), //the day of the month (1-31)
        day: day // the day of the week (0-6)
      };
    }
  }
};

// Object.assign polyfill, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}