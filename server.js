var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('keys/key.pem'),
  cert: fs.readFileSync('keys/cert.pem'),
    passphrase: '1234'
};

// Create a service (the app object is just a callback).
var app = express();
app.use("/", express.static(__dirname + "/demo"));

// Create an HTTP service.
http.createServer(app).listen(5080);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(5443);
