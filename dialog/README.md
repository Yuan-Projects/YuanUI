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
