QUnit.module("Calendar.utils.date.getCalendarDaysInMonth");
QUnit.test('November 2018', function(assert){
  const days = Calendar.utils.date.getCalendarDaysInMonth(2018, 11);
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
  const days = Calendar.utils.date.getCalendarDaysInMonth(2018, 12);
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