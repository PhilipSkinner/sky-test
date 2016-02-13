/*
    main.js    
    Author      - Philip Skinner (me@philip-skinner.co.uk)
*/

var express     = require('express');
var q           = require('q');
var mysql       = require('./node/db');
var exports     = module.exports = {};

//might want to set this via config or args later
var port        = 8080;
var debug       = true;
var app         = express();

//connect to our database
mysql.db.initialize({
    hostname    : 'localhost',
    database    : 'sky',
    username    : 'sky',
    password    : 'sky',
})

//enable static serving
app.use(express.static('site'));

app.get('/api/v1/confirm', function(req, res) {
    
});

app.get('/api/v1/customer/location', function(req, res) {
    var customerID = null;        
    
    customerID = req.query.customerID ? req.query.customerID : customerID;
    customerID = req.query.customerId ? req.query.customerId : customerID;
    customerID = req.query.customerid ? req.query.customerid : customerID;
    
    if (customerID == null) {
        res.jsonp({
            meta    : {
                code    : 500,
                message : 'Missing customerID argument',                
            },            
        });
        return;
    }
    
    //is the user valid?
    q.when(mysql.db.fetchCustomer(customerID))
    .then(function(value) {
        if (value) {
            var data = value[0];
            
            if (data && data.length == 0) {
                //no such user, sorry :(
                this.res.jsonp({
                    meta    : {
                        code    : 404,
                        message : 'No such user found',
                    }
                });
                return;                  
            } 
            
            var user = data[0];
            
            //we have a user, lets get the location
            q.when(mysql.db.fetchLocation(user.location))
            .then(function(value) {
                if (value) {
                    var data = value[0];
                    
                    if (data && data.length ==0) {
                        //no location, shouldn't be possible with DB schema
                        this.res.jsonp({
                            meta    : {
                                code    : 404,
                                message : 'No such location found',
                            }
                        });
                        return;
                    }
                    
                    //we have a location, lets return it
                    this.res.jsonp({
                        data    : {
                            locationID  : data[0].location_id,
                        } 
                    });
                    return;
                } else {
                    this.res.jsonp({
                        meta    : {
                            code    : 500,
                            message : 'Database did not respond with an expected result',  
                        },
                    });
                    return; 
                }                
            }.bind(this), function(error) {
                this.res.jsonp({
                    meta    : {
                        code    : 500,
                        message : 'Unknown database error occured.',  
                    },
                });
                return;
            }.bind(this));
        } else {
            this.res.jsonp({
               meta : {
                    code    : 500, //we'll sort these codes out later in the tests
                    message : 'Database did not respond with an expected result', 
               } ,
            });
            return;
        }
    }.bind({ res : res, req : req }), function(error) {
        this.res.jsonp({
            meta    : {
                code    : 500,
                message : 'Unknown database error occured.',  
            },
        });
        return;
    }.bind({ res : res, req : req }));        
});

app.get('/api/v1/catalogue', function(req, res) {
    res.send("1");
});

var server = app.listen(port, function() {
    //console.log("Server is running on port:", port); 
});

exports.shutdown = function() {
    server.close();
};