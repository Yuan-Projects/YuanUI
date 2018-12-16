# dialog

A jQuery/Zepto dialog plugin

Demo: https://yuan-projects.github.io/YuanUI/dialog/

## Usage

 1. Include this plugin files to your web page
```
<!DOCTYPE html>
<html lang="en">
<head>
    ...
    <link rel="stylesheet" type="text/css" href="path/to/dialog.css" />
</head>
<body>
    ...
    <script src="//code.jquery.com/jquery-1.12.4.js"></script>
    <script src="path/to/jquery.dialog.js"></script>
</body>
</html>
```
 2. Add dialog contents
```
<!-- Dialog main container -->
<div id="authPop">
  <p>test</p>
</div>
```
 3. Initialize this plugin
```
$(function() {
  $('#authPop').dialog({
    width: 520
  });
});
```

## Parameters
| Parameter        | Type           | Default  |  Description |
| ------------- |:-------------:| -----:| -----:|
| width      | number | 520 | Dialog width in px. |
| title      | string      |   'New Dialog' | Dialog title. |
| resizable | boolean      |    false | Is this dialog resizable |
| buttons | null or aray | null | Buttons at the bottom of the dialog. |
| customCls | string | '' | Custom css class to be attached on the dialog. |
| onaftershow | function | function(){} | The callback function after dialog displayed. |
