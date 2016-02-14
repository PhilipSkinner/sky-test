/*
    main.js    
    Author      - Philip Skinner (me@philip-skinner.co.uk)
*/

var express     = require('express');
var q           = require('q');
var mysql       = require('./node/db');
var exports     = module.exports = {};
var bodyParser  = require('body-parser');

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

//body parsing
app.use(bodyParser.urlencoded({
    extended : true,
}));

app.post('/confirm', function(req, res) {
    //just display the values for confirmation    
    var args = req.body;        
    
    res.json(args);
    return; 
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
    .then(confirmUser.bind({ res : res, req : req }), 
    function(error) {
        this.res.jsonp({
            meta    : {
                code    : 500,
                message : 'Unknown database error occured.',  
            },
        });
        return;
    }.bind({ res : res, req : req }));       
});

//for confirming the user data, see use above
function confirmUser(value) {
    if (value) {
        var data = value[0];
        
        if (!data || data.length == 0) {
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
        .then(findLocation.bind(this), function(error) {
            this.res.jsonp({
                meta    : {
                    code    : 500,
                    message : 'Unknown database error occured.',  
                },
            });
            return;
        });
    } else {
        this.res.jsonp({
            meta : {
                code    : 500, //we'll sort these codes out later in the tests
                message : 'Database did not respond with an expected result', 
            } ,
        });
        return;
    }
}

//for finding the location, used in promise in confirmUser
function findLocation(value) {
    if (value) {
        var data = value[0];
        
        if (!data || data.length ==0) {
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
            data    : data[0],
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
}

app.get('/api/v1/catalogue', function(req, res) {
    var locationID = null;
    
    locationID = req.query.locationID ? req.query.locationID : locationID;
    locationID = req.query.locationId ? req.query.locationId : locationID;
    locationID = req.query.locationid ? req.query.locationid : locationID;
    
    if (locationID == null) {
        res.jsonp({
            meta    : {
                code    : 500,
                message : 'Missing locationID argument',  
            },
        });
        return;
    }
    
    //is the location valid?
    q.when(mysql.db.fetchLocationByID(locationID))
    .then(confirmLocation.bind({ res : res, req : req }),
    function(error) {
        this.res.jsonp({
            meta    : {
                code    : 500,
                message : 'Unknown database error occured.',  
            },
        });
        return;
    }.bind({ res : res, req : req }));
        
    return;
});

//used above
function confirmLocation(value) {
    if (value) {
        var data = value[0];
        
        if (!data || data.length == 0) {
            this.res.jsonp({
                meta    : {
                    code    : 404,
                    message : "No such location found",  
                },
            });
            return;
        }                           
        
        //its all good, so we can continue to fetch the catalogue
        q.when(mysql.db.fetchCatalogue(data[0].uid))
        .then(returnCatalogue.bind(this),
        function(error) {
            this.res.jsonp({
                meta    : {
                    code    : 500,
                    message : 'Unknown database error occured.',  
                },
            });
            return;
        }.bind(this));
        return;
    } else {
        this.res.jsonp({
            meta : {
                code    : 500,
                message : 'Database did not respond with an expected result', 
            } ,
        });
        return;
    }
}

//used within promise in confirmLocation
function returnCatalogue(value) {
    if (value) {
        var ret = {};
        for (var i = 0; i < value[0].length; i++) {
            var item = value[0][i];
            if (!ret[item['name']]) {
                ret[item['name']] = [];
            }
            
            ret[item['name']].push(item);
        }
        
        //we'll return an empty array of values this time, let the UI handle no results etc
        this.res.jsonp({
            data    : ret,
        });
        return;
    } else {
        this.res.jsonp({
            meta : {
                code    : 500,
                message : 'Database did not respond with an expected result', 
            } ,
        });
        return;
    }
    this.res.jsonp({});
}

var server = app.listen(port, function() {
    //console.log("Server is running on port:", port); 
});

exports.shutdown = function() {
    server.close();
};