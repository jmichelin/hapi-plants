var express = require("express");
var open = require('open');

/*
Set up Defaults
 */
var app = express();
const port = 8080;


app.get('/', function (req, res) {
  res.send('Hello World')
});




//Launch Server
app.listen(port);
console.log('Server is listening on ', port, ' at address localhost');
open('http://localhost:8080');