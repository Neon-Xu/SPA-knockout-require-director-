var express = require('express');
var app = express();

app.use('/', express.static('views'));
app.use('/resources', express.static('resources'));




var server = app.listen(3010, function () {
  console.log('Server start..');
});
