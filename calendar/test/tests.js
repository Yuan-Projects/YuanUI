QUnit.test('Calendar.utils.date.getCalendarDaysInMonth', function(assert){
  const days = Calendar.utils.date.getCalendarDaysInMonth(2018, 11);
  assert.equal(days.length, 42);
  assert.deepEqual(days[0], {
    year: 2018,
    month: 10,
    date: 29, //the day of the month (1-31)
    day: 1// the day of the week (0-6)
  });
});