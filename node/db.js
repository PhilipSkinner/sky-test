var mysql = require('mysql');
var q = require('q');

//no ORM, just quick
var db = {
    connection  : null,
    
    initialize: function(params) {
        this.connection = mysql.createConnection({
            host        : params.hostname,
            database    : params.database,
            user        : params.username,
            password    : params.password,
        });
        this.connection.connect();
        
        //init our methods now
        this.initMethods();        
    },
        
    initMethods : function() {
        this.fetchCustomer = q.nbind(this.connection.query, this.connection, "SELECT * FROM customer WHERE uid=?");
        this.fetchLocation = q.nbind(this.connection.query, this.connection, "SELECT * FROM location WHERE uid=?");        
    },    
}

module.exports = {
    db : Object.create(db),  
};