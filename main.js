/*
    main.js    
    Author      - Philip Skinner (me@philip-skinner.co.uk)
*/

var express     = require('express');

//might want to set this via config or args later
var port        = 8080;
var debug       = true;
var app         = express();

//enable static serving
app.use(express.static('site'));

app.get('/api/v1/confirm', function(req, res) {
    res.send("1");
});

app.get('/api/v1/customer/location', function(req, res) {
    res.send("1");
});

app.get('/api/v1/catalogue', function(req, res) {
    res.send("1");
});

var server = app.listen(port, function() {
    console.log("Server is running on port:", port); 
});