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

QUnit.test('Check if the calendar DOM is created successfully or not', function(assert) {
  var options = {
    inputElement: document.getElementById('myinput')
  };
  var instance = new Calendar(options);
  var calendarDom = document.getElementById('qunit-fixture').getElementsByClassName('yuanui-calendar');
  assert.deepEqual(calendarDom.length, 1, "There is only one calendar root element.");
});

QUnit.test('The date value was populated in the input control after a date was clicked.', function(assert) {
  var options = {
    inputElement: document.getElementById('myinput'),
    year: 2018,
    month: 11
  };
  var instance = new Calendar(options);
  var dateTds = instance.dateTableElement.getElementsByTagName('td');
  dateTds[0].click();
  assert.deepEqual(options.inputElement.value, "2018-10-29", "The input value 2018-10-29");
});

QUnit.test('The date value was populated in the input control after a date was clicked #2', function(assert) {
  var options = {
    inputElement: document.getElementById('myinput'),
    year: 2018,
    month: 11
  };
  var instance = new Calendar(options);
  var dateTds = instance.dateTableElement.getElementsByTagName('td');
  dateTds[41].click();
  assert.deepEqual(options.inputElement.value, "2018-12-09", "The input value 2018-12-09");
});