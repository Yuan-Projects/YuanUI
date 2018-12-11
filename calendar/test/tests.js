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