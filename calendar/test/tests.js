QUnit.module("Calendar.parseDate");
function testParseDate(description, str, format, year, month, day) {
  var parseDate = Calendar.parseDate;
  var date = parseDate(str, format);
  QUnit.test(description, function(assert) {
    assert.deepEqual(date.getFullYear(), year);
    assert.deepEqual(date.getMonth() + 1, month);
    assert.deepEqual(date.getDate(), day);
  });
}

testParseDate("2018-12-05 Y-m-d", "2018-12-05", 'Y-m-d', 2018, 12, 5);
testParseDate("2018-12-05 Y-d-m", "2018-12-05", 'Y-d-m', 2018, 5, 12);
testParseDate("2018-12-5 Y-m-j", "2018-12-5", 'Y-m-j', 2018, 12, 5);

QUnit.test("An exception should be thrown if the date string not match with the format", function(assert) {
  var parseDate = Calendar.parseDate;
  var str = "1989-06-04", format = "Y-n-x";
  
  assert.throws(function() {
    parseDate(str, format);
  },
  function(err) {
    return err.toString() === "Date string does not match format expected";
  },
  "An exception should be thrown.");
});

QUnit.module("Calendar.utils.date.getCalendarDaysInMonth");
QUnit.test('November 2018', function(assert){
  var days = Calendar.utils.date.getCalendarDaysInMonth(2018, 11);
  assert.equal(days.length, 42, "There are 42 days on the calendar panel of November, 2018");
  assert.deepEqual(days[0], {
    year: 2018,
    month: 10,
    date: 29, //the day of the month (1-31)
    day: 1// the day of the week (0-6)
  }, "The first day on this panel is October 29, 2018, and it's a Monday.");
  assert.deepEqual(days[41], {
    year: 2018,
    month: 12,
    date: 9, //the day of the month (1-31)
    day: 0// the day of the week (0-6)
  }, "The last day on this panel is December 9, 2018, and it's a Sunday.");
});
QUnit.test('December 2018', function(assert){
  var days = Calendar.utils.date.getCalendarDaysInMonth(2018, 12);
  assert.equal(days.length, 42, "There are 42 days on the calendar panel of December, 2018");
  assert.deepEqual(days[0], {
    year: 2018,
    month: 11,
    date: 26, //the day of the month (1-31)
    day: 1// the day of the week (0-6)
  }, "The first day on this panel is November 26, 2018, and it's a Monday.");
  assert.deepEqual(days[41], {
    year: 2019,
    month: 1,
    date: 6, //the day of the month (1-31)
    day: 0// the day of the week (0-6)
  }, "The last day on this panel is January 6, 2019, and it's a Sunday.");
});

QUnit.module("Calendar.utils.date.getLastDatesOfMonth");
QUnit.test('The last three days in October, 2018', function(assert) {
  var lastThreeDays = Calendar.utils.date.getLastDatesOfMonth(2018, 10, 3);
  assert.equal(lastThreeDays.length, 3, "3 days returned as expected");
  assert.deepEqual(lastThreeDays[0], {
    year: 2018,
    month: 10,
    date: 29, //the day of the month (1-31)
    day: 1 // the day of the week (0-6)
  });
  assert.deepEqual(lastThreeDays[1], {
    year: 2018,
    month: 10,
    date: 30, //the day of the month (1-31)
    day: 2 // the day of the week (0-6)
  });
  assert.deepEqual(lastThreeDays[2], {
    year: 2018,
    month: 10,
    date: 31, //the day of the month (1-31)
    day: 3 // the day of the week (0-6)
  });
});
QUnit.test('The last two days in November, 2018', function(assert) {
  var lastDays = Calendar.utils.date.getLastDatesOfMonth(2018, 11, 2);
  assert.equal(lastDays.length, 2, "2 days returned as expected");
  assert.deepEqual(lastDays[0], {
    year: 2018,
    month: 11,
    date: 29, //the day of the month (1-31)
    day: 4 // the day of the week (0-6)
  });
  assert.deepEqual(lastDays[1], {
    year: 2018,
    month: 11,
    date: 30, //the day of the month (1-31)
    day: 5 // the day of the week (0-6)
  });
});

QUnit.module("Calendar.utils.date.monthInfo");
QUnit.test('November 2014 information', function(assert) {
  var info = Calendar.utils.date.monthInfo(2014, 11);
  assert.equal(info.days, 30, "There are 30 days in November, 2014");
  assert.deepEqual(info.firstDay, {
    year: 2014,
    month: 11,
    date: 1,
    day: 6
  }, "The first day of this month is November 1, 2014, it's a Saturday.");
  assert.deepEqual(info.lastDay, {
    year: 2014,
    month: 11,
    date: 30,
    day: 0
  }, "The last day of this month is November 1, 2014, it's a Sunday.");
  assert.equal(info.firstDayOfWeek, 6, "The first day is a Saturday.");
  assert.equal(info.lastDayOfWeek, 0, "The last day is a Sunday.");
});
QUnit.test('January 2019 information', function(assert) {
  var info = Calendar.utils.date.monthInfo(2019, 1);
  assert.equal(info.days, 31, "There are 31 days in January, 2019");
  assert.deepEqual(info.firstDay, {
    year: 2019,
    month: 1,
    date: 1,
    day: 2
  }, "The first day of this month is January 1, 2019, it's a Tuesday.");
  assert.deepEqual(info.lastDay, {
    year: 2019,
    month: 1,
    date: 31,
    day: 4
  }, "The last day of this month is January 31, 2019, it's a Thursday.");
  assert.equal(info.firstDayOfWeek, 2, "The first day is a Tuesday.");
  assert.equal(info.lastDayOfWeek, 4, "The last day is a Thursday.");
});

QUnit.module("Calendar.utils.date.getFirstDayOfMonth");
QUnit.test('Returns the first day of October, 2018', function(assert) {
  var info = Calendar.utils.date.getFirstDayOfMonth(2018, 10);
  assert.deepEqual(info, {
    year: 2018,
    month: 10,
    date: 1,
    day: 1
  }, "The first day of this month is October 1, 2018, it's a Monday.");
});
QUnit.test('Returns the first day of September, 2018', function(assert) {
  var info = Calendar.utils.date.getFirstDayOfMonth(2018, 9);
  assert.deepEqual(info, {
    year: 2018,
    month: 9,
    date: 1,
    day: 6
  }, "The first day of this month is September 1, 2018, it's a Saturday.");
});

QUnit.module("Calendar.utils.date.getLastDayOfMonth");
QUnit.test('Returns the last day of October, 2018', function(assert) {
  var info = Calendar.utils.date.getLastDayOfMonth(2018, 10);
  assert.deepEqual(info, {
    year: 2018,
    month: 10,
    date: 31,
    day: 3
  }, "The last day of this month is October 31, 2018, it's a Wednesday.");
});
QUnit.test('Returns the last day of September, 2018', function(assert) {
  var info = Calendar.utils.date.getLastDayOfMonth(2018, 9);
  assert.deepEqual(info, {
    year: 2018,
    month: 9,
    date: 30,
    day: 0
  }, "The last day of this month is September 30, 2018, it's a Sunday.");
});

QUnit.module("Calendar.utils.date.dayInfo");
QUnit.test('Call this function with a Date() instance', function(assert) {
  var info = Calendar.utils.date.dayInfo(new Date(2018, 8, 7));
  assert.deepEqual(info, {
    year: 2018,
    month: 9,
    date: 7,
    day: 5
  });
});
QUnit.test('Call this function with three parameters', function(assert) {
  var info = Calendar.utils.date.dayInfo(2018, 9, 7);
  assert.deepEqual(info, {
    year: 2018,
    month: 9,
    date: 7,
    day: 5
  });
});

QUnit.module("Calendar instance");
QUnit.test('Create a new instance', function(assert) {
  var options = {
    inputElement: document.getElementById('myinput')
  };
  var instance = new Calendar(options);
  assert.ok(instance);
});

QUnit.test('The calendar DOM should not be created until the input is focused', function(assert) {
  var options = {
    inputElement: document.getElementById('myinput')
  };
  var instance = new Calendar(options);
  var calendarDom = document.getElementById('qunit-fixture').getElementsByClassName('yuanui-calendar');
  assert.deepEqual(calendarDom.length, 0, "There is no calendar root element found.");
});

QUnit.test('The calendar DOM should be created after the input was focused', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput')
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var calendarDom = document.getElementById('qunit-fixture').getElementsByClassName('yuanui-calendar');
    assert.deepEqual(calendarDom.length, 1, "The calendar root element has been created.");
    done();
  }, 100);
});

QUnit.test('The calendar DOM should be removed after the input had lost focus', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput')
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    options.inputElement.blur();
    setTimeout(function() {
      var calendarDom = document.getElementById('qunit-fixture').getElementsByClassName('yuanui-calendar');
      assert.deepEqual(calendarDom.length, 0, "The calendar root element has been removed.");
      done();
    }, 100);
  }, 100);
});

QUnit.test('The calendar DOM should be created again after the input had lost focus then had focus again', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput')
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    options.inputElement.blur();
    setTimeout(function() {
      options.inputElement.focus();
      setTimeout(function() {
        var calendarDom = document.getElementById('qunit-fixture').getElementsByClassName('yuanui-calendar');
        assert.deepEqual(calendarDom.length, 1, "The calendar root element has been created again.");
        done();
      }, 100);
    }, 100);
  }, 100);
});

QUnit.test('The date value was populated in the input control after a date was clicked.', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput'),
    year: 2018,
    month: 11
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    dateTds[0].click();
    setTimeout(function() {
      assert.deepEqual(options.inputElement.value, "2018-10-29", "The input value 2018-10-29");
      done();
    }, 100);
  }, 100);
});

QUnit.test('The date value was populated in the input control after a date was clicked #2', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput'),
    year: 2018,
    month: 11
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    dateTds[41].click();
    setTimeout(function() {
      assert.deepEqual(options.inputElement.value, "2018-12-09", "The input value 2018-12-09");
      done();
    }, 100);
  }, 100);
});

QUnit.module("Custom date format tests");
QUnit.test('format character #0: defaults to Y-m-d', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput'),
    year: 2018,
    month: 11
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    dateTds[41].click();
    setTimeout(function() {
      assert.deepEqual(options.inputElement.value, "2018-12-09", "The input value is 2018-12-09");
      done();
    }, 100);
  }, 100);
});

QUnit.test('format character "d": Day of the month, 2 digits with leading zeros -	01 to 31', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput2'),
    year: 2018,
    month: 11
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    dateTds[41].click();
    setTimeout(function() {
      assert.deepEqual(options.inputElement.value, "09", "The input value is '09'");
      done();
    }, 100);
  }, 100);
});

QUnit.test('format character "j": Day of the month without leading zeros - 1 to 31', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput3'),
    year: 2018,
    month: 11
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    dateTds[41].click();
    setTimeout(function() {
      assert.deepEqual(options.inputElement.value, "9", "The input value is '9'");
      done();
    }, 100);
  }, 100);
});

QUnit.test('format character "w": Numeric representation of the day of the week - 0 (for Sunday) through 6 (for Saturday)', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput4'),
    year: 2018,
    month: 11
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    dateTds[41].click();
    setTimeout(function() {
      assert.deepEqual(options.inputElement.value, "0", "The input value is '0'");
      done();
    }, 100);
  }, 100);
});

QUnit.test('format character "m" Numeric representation of a month, with leading zeros - 01 through 12', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput5'),
    year: 2018,
    month: 8
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    dateTds[41].click();
    setTimeout(function() {
      assert.deepEqual(options.inputElement.value, "09", "The input value is '09'");
      done();
    }, 100);
  }, 100);
});

QUnit.test('format character "n": Numeric representation of a month, without leading zeros - 1 through 12', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput6'),
    year: 2018,
    month: 8
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    dateTds[41].click();
    setTimeout(function() {
      assert.deepEqual(options.inputElement.value, "9", "The input value is '9'");
      done();
    }, 100);
  }, 100);
});

QUnit.test('format character "Y": A full numeric representation of a year, 4 digits', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput7'),
    year: 2018,
    month: 8
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    dateTds[41].click();
    setTimeout(function() {
      assert.deepEqual(options.inputElement.value, "2018", "The input value is '2018'");
      done();
    }, 100);
  }, 100);
});

QUnit.test('format character "y": A two digit representation of a year', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput8'),
    year: 2018,
    month: 8
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    dateTds[41].click();
    setTimeout(function() {
      assert.deepEqual(options.inputElement.value, "18", "The input value is '18'");
      done();
    }, 100);
  }, 100);
});

QUnit.test('format character "Y年m月d日"', function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput9'),
    year: 2018,
    month: 11
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    dateTds[41].click();
    setTimeout(function() {
      assert.deepEqual(options.inputElement.value, "2018年12月09日", "The input value is '2018年12月09日'");
      done();
    }, 100);
  }, 100);
});

QUnit.module("i18n tests");
QUnit.test("Show the calendar in Chinese", function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput9'),
    year: 2018,
    month: 11,
    locale: 'zh'
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var ths = instance.dateTableElement.getElementsByTagName('th');
    assert.deepEqual(ths[0].innerHTML, "一");
    assert.deepEqual(instance.headerTable.getElementsByClassName('rangeIndicator')[0].innerHTML, '2018年11月', "Current month");
    done();
  }, 100);
});

QUnit.test("Show the calendar in English", function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput9'),
    year: 2018,
    month: 11,
    locale: 'en'
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    var ths = instance.dateTableElement.getElementsByTagName('th');
    assert.deepEqual(ths[0].innerHTML, "Mo", "The first day of the week");
    assert.deepEqual(instance.headerTable.getElementsByClassName('rangeIndicator')[0].innerHTML, 'November 2018', "Current month");
    done();
  }, 100);
});

QUnit.module("default values");
QUnit.test("#myinput10 defaults to 1989-06-04", function(assert) {
  var done = assert.async();
  var options = {
    inputElement: document.getElementById('myinput10')
  };
  var instance = new Calendar(options);
  options.inputElement.focus();
  setTimeout(function() {
    assert.deepEqual(instance.headerTable.getElementsByClassName('rangeIndicator')[0].innerHTML, '1989年6月');
    var dateTds = instance.dateTableElement.getElementsByTagName('td');
    var firstTd = dateTds[0], firstDay = JSON.parse(firstTd.getAttribute('data-date'));
    assert.deepEqual(firstDay.year, 1989);
    assert.deepEqual(firstDay.month, 5);
    assert.deepEqual(firstDay.date, 29);
    done();
  }, 100);
});