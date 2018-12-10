function Calendar(options) {
  var now = new Date();
  var rootElement = null;
  var elementHandlers = [];
  
  this.inputElement = options.inputElement;
  this.headerTable = null;
  this.dateTableElement = null;
  this.options = Calendar.extend({}, {
    locale: 'zh'
  }, options);
  this.year = options.year || now.getFullYear();
  this.month = options.month || (now.getMonth() + 1);
  
  this.locales = {
    zh: {
      daysOfWeek: ['一', '二', '三', '四', '五', '六', '日'],
      currentMonthText: "Y年n月"
    },
    en: {
      daysOfWeek: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      currentMonthText: "F Y"
    }
  };
  
  this.currentLocale = this.locales[this.options.locale];
  
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
    headerTableTd1.innerHTML = Calendar.date(that.currentLocale.currentMonthText, Calendar.getUnixTimestamp({year: that.year, month: that.month, date: 1}));

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

    Calendar.each(that.currentLocale.daysOfWeek, function(currentValue) {
      var newEL = document.createElement('th');
      newEL.innerHTML = currentValue;
      dateTableTheadTr.appendChild(newEL);
    });
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
    console.log('focus');
    that.insertToDOM();
    that.setCalendarPosition();
    that.renderDatesInTable(that.year, that.month);
  };
  var blurHandler = function(e) {
    that.removeRootElement();
  };
  var clickHandler = function(e) {
    var target = e.target || e.srcElement || document;
    if (Calendar.hasClass(target, 'uparrow')) {
      that.month--;
      that.normalizeYearMonth();
      that.renderDatesInTable(that.year, that.month);
      that.renderHeaderTableDate();
    } else if (Calendar.hasClass(target, 'downarrow')) {
      that.month++;
      that.normalizeYearMonth();
      that.renderDatesInTable(that.year, that.month);
      that.renderHeaderTableDate();
    }
  };
  this.addEventListener(this.options.inputElement, "focus", focusHandler);
  this.addEventListener(this.options.inputElement, "blur", blurHandler);
  this.addEventListener(this.headerTable, "click", clickHandler);
  
  this.addEventListener(this.getRootElement(), "mousedown", function(e) {
    var evt = e || window.event;
    var target = e.target || e.srcElement || document;
    if (evt.preventDefault) {
      evt.preventDefault();
    } else {
      target.unselectable = true; // important!
    }
  });
  
  this.addEventListener(this.dateTableElement, "click", function(e) {
    var target = e.target || e.srcElement || document;
    var targetDate = null;
    if (target.tagName === "TD" && target.getAttribute('data-date')) {
      var format = that.options.inputElement.getAttribute('data-format') || 'Y-m-d';
      targetDate = JSON.parse(target.getAttribute('data-date'));
      that.inputElement.value = Calendar.date(format, Calendar.getUnixTimestamp(targetDate));
      that.inputElement.blur();
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
  Calendar.addEvent(el, type, listener);
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
  Calendar.each(monthInfo, function(currentValue, index, array) {
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
    Calendar.removeEvent(obj["el"], obj["tp"], obj["cb"]);
  }
  handlers.length = 0;
  Calendar.utils.dom.remove(this.getRootElement(), true);
};

Calendar.addEvent = function(dom, type, fn) {
  if (document.addEventListener) {
    dom.addEventListener(type, fn, false);
  } else if (document.attachEvent) {
    dom.attachEvent('on' + type, fn);
  }
};

Calendar.removeEvent = function(dom, type, fn) {
  if (document.removeEventListener) {
    dom.removeEventListener(type, fn, false);
  } else if (document.detachEvent) {
    dom.detachEvent('on' + type, fn);
  }
};

Calendar.getUnixTimestamp = function(dateObj) {
  var date = dateObj ? new Date(dateObj.year, dateObj.month - 1, dateObj.date) : new Date();
  return Math.floor(date.valueOf() / 1000);  
};

Calendar.hasClass = function(el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
};

/**
 * Parse a date string to a JavaScript date object.
 * @param {string} input
 * @param {string} format
 * @return {Date}
 */
Calendar.parseDate = function(input, format) {
  format = format || 'Y-m-d'; // somedefault format
  var exp = {
    Y: '([0-9]{4})',
    m: '([0-9]{2})',
    n: '([0-9]{1,2})',
    d: '([0-9]{2})',
    j: '([0-9]{1,2})'
  };
  var fmt = {}, i = 0;
  var str = format.replace(/Y|m|n|d|j/g, function(matched) {
    // extract date-part indexes from the format
    fmt[matched] = i++;
    // generate regexp string
    return exp[matched];
  });
  var parts = new RegExp('^' + str + '$').exec(input);
  if (!parts) throw "Date string does not match format expected";
  var parts2 = parts.slice(1);
  return new Date(parts2[fmt['Y']], parts2[fmt['n'] || fmt['m']] - 1, parts2[fmt['j'] || fmt['d']]);
};

/**
 * Format a local time/date
 * @see http://locutus.io/php/datetime/date/
 * @param {string} format The format of the outputted date string.
 * @param {number} timestamp The optional timestamp parameter is an integer Unix timestamp that defaults to the current local time.
 * @return {string} Returns a formatted date string.
 */
Calendar.date = function(format, timestamp) {
  var jsdate, f;
  // Keep this here (works, but for code commented-out below for file size reasons)
  // var tal= [];
  var txtWords = [
    'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  // trailing backslash -> (dropped)
  // a backslash followed by any character (including backslash) -> the character
  // empty string -> empty string
  var formatChr = /\\?(.?)/gi;
  var formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s;
  };
  var _pad = function (n, c) {
    n = String(n);
    while (n.length < c) {
      n = '0' + n;
    }
    return n;
  };
  f = {
    // Day
    d: function () {
      // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2);
    },
    D: function () {
      // Shorthand day name; Mon...Sun
      return f.l().slice(0, 3);
    },
    j: function () {
      // Day of month; 1..31
      return jsdate.getDate();
    },
    l: function () {
      // Full day name; Monday...Sunday
      return txtWords[f.w()] + 'day';
    },
    N: function () {
      // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7;
    },
    S: function () {
      // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j();
      var i = j % 10;
      if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
        i = 0;
      }
      return ['st', 'nd', 'rd'][i - 1] || 'th';
    },
    w: function () {
      // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay();
    },
    z: function () {
      // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j());
      var b = new Date(f.Y(), 0, 1);
      return Math.round((a - b) / 864e5);
    },

    // Week
    W: function () {
      // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
      var b = new Date(a.getFullYear(), 0, 4);
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
    },

    // Month
    F: function () {
      // Full month name; January...December
      return txtWords[6 + f.n()];
    },
    m: function () {
      // Month w/leading 0; 01...12
      return _pad(f.n(), 2);
    },
    M: function () {
      // Shorthand month name; Jan...Dec
      return f.F().slice(0, 3);
    },
    n: function () {
      // Month; 1...12
      return jsdate.getMonth() + 1;
    },
    t: function () {
      // Days in month; 28...31
      return (new Date(f.Y(), f.n(), 0)).getDate();
    },

    // Year
    L: function () {
      // Is leap year?; 0 or 1
      var j = f.Y();
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
    },
    o: function () {
      // ISO-8601 year
      var n = f.n();
      var W = f.W();
      var Y = f.Y();
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
    },
    Y: function () {
      // Full year; e.g. 1980...2010
      return jsdate.getFullYear();
    },
    y: function () {
      // Last two digits of year; 00...99
      return f.Y().toString().slice(-2);
    },

    // Time
    a: function () {
      // am or pm
      return jsdate.getHours() > 11 ? 'pm' : 'am';
    },
    A: function () {
      // AM or PM
      return f.a().toUpperCase();
    },
    B: function () {
      // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2;
      // Hours
      var i = jsdate.getUTCMinutes() * 60;
      // Minutes
      // Seconds
      var s = jsdate.getUTCSeconds();
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
    },
    g: function () {
      // 12-Hours; 1..12
      return f.G() % 12 || 12;
    },
    G: function () {
      // 24-Hours; 0..23
      return jsdate.getHours();
    },
    h: function () {
      // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2);
    },
    H: function () {
      // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2);
    },
    i: function () {
      // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2);
    },
    s: function () {
      // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2);
    },
    u: function () {
      // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6);
    },

    // Timezone
    e: function () {
      var msg = 'Not supported (see source code of date() for timezone on how to add support)';
      throw new Error(msg);
    },
    I: function () {
      // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      var a = new Date(f.Y(), 0);
      // Jan 1
      var c = Date.UTC(f.Y(), 0);
      // Jan 1 UTC
      var b = new Date(f.Y(), 6);
      // Jul 1
      // Jul 1 UTC
      var d = Date.UTC(f.Y(), 6);
      return ((a - c) !== (b - d)) ? 1 : 0;
    },
    O: function () {
      // Difference to GMT in hour format; e.g. +0200
      var tzo = jsdate.getTimezoneOffset();
      var a = Math.abs(tzo);
      return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
    },
    P: function () {
      // Difference to GMT w/colon; e.g. +02:00
      var O = f.O();
      return (O.substr(0, 3) + ':' + O.substr(3, 2));
    },
    T: function () {
      return 'UTC';
    },
    Z: function () {
      // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60;
    },

    // Full Date/Time
    c: function () {
      // ISO-8601 date.
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
    },
    r: function () {
      // RFC 2822
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
    },
    U: function () {
      // Seconds since UNIX epoch
      return jsdate / 1000 | 0;
    }
  };

  var _date = function (format, timestamp) {
    jsdate = (timestamp === undefined ? new Date() // Not provided
      : (timestamp instanceof Date) ? new Date(timestamp) // JS Date()
      : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    );
    return format.replace(formatChr, formatChrCb);
  };

  return _date(format, timestamp);
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
        result.push(Calendar.extend({}, thisMonthInfo.lastDay, {
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

/**
 *
 * Convert function arguments to an array.
 * The arguments object can be converted to a real Array by using:
 * var args = Array.prototype.slice.call(arguments);
 * But it prevents optimizations in JavaScript engines(V8 for example).
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
 * @param {Object} args The Array-like object.
 * @return {Array}
 */
Calendar.getArgumentsArray = function(args) {
  var result = [],
    len = args.length,
    i;
  for (i = 0; i < len; i++) {
    result.push(args[i]);
  }
  return result;
};

/**
 *
 * Check if a Javascript variable is a DOM element.
 * @param {*} element The variable to be tested.
 * @return {boolean} True if this variable is a DOM element, false otherwise.
 */
Calendar.isElement = function(element) {
  try {
    return element instanceof Element || element instanceof HTMLDocument;
  } catch (e) {
    return false;
  }
};

/**
 * Determine whether the argument is an array.
 * @param {*} obj The Object to test.
 * @return {Boolean} True if it's an array, false otherwise.
 */
Calendar.isArray = function(obj) {
  if (Array.isArray) {
    return Array.isArray(obj);
  }
  return Object.prototype.toString.call(obj) === '[object Array]';
};

/**
 * Executes a provided function once for each array element.
 * @param {Array|Object} obj The array to iterate over.
 * @param {Function} callback The function will be executed on every item.
 * @return {undefined}
 */
Calendar.each = function(obj, callback) {
  var length, i = 0;
  if(Calendar.isArray(obj)) {
    length = obj.length;
    for ( ; i < length; i++ ) {
      if ( callback.call( obj[ i ], obj[ i ], i ) === false ) {
        break;
      }
    }
  } else {
    for (i in obj) {
      if ( callback.call( obj[ i ], obj[ i ], i ) === false ) {
        break;
      }
    }
  }
};

/**
 * Creates a new array with the results of calling a provided function on every element in the calling array.
 * Not in use.
 * 
 * @param {Array} array The array to translate.
 * @param {Function} callback The function to process each items against.
 * @return {Array} A new array.
 */
Calendar.map = function(array, callback) {
  var len = array.length;
  var result = new Array(len);
  for (var i = 0; i < len; i++) {
    result[i] = callback.call(array, array[i], i);
  }
  return result;
};

/**
 * Merge multiple objects dynamically with modifying either arguments.
 * Inspired by http://stackoverflow.com/questions/171251#16178864
 * @example extend(obj1, obj2, ....);
 * @return {object} The merged object.
 */
Calendar.extend = function extend() {
  var result = {}, 
      src, 
      prop, 
      args = Calendar.getArgumentsArray(arguments),
      hasOwnProperty = Object.prototype.hasOwnProperty,
      toString = Object.prototype.toString;

  if (typeof Object.assign === "function") {
    return Object.assign.apply(null, args);
  }

  while (args.length > 0) {
    src = args.shift();
    if (toString.call(src) === "[object Object]") {
      for (prop in src) {
        if (hasOwnProperty.call(src, prop)) {
          if (!Calendar.isElement(src[prop]) && toString.call(src[prop]) === '[object Object]') {
            result[prop] = extend(result[prop] || {}, src[prop]);
          } else {
            result[prop] = src[prop];
          }
        }
      }
    }
  }
  return result;
};