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
        this.fetchCustomer      = q.nbind(this.connection.query, this.connection, "SELECT * FROM customer WHERE uid=?");
        this.fetchLocation      = q.nbind(this.connection.query, this.connection, "SELECT * FROM location WHERE uid=?");
        this.fetchLocationByID  = q.nbind(this.connection.query, this.connection, "SELECT * FROM location WHERE location_id=?");
        this.fetchCatalogue     = q.nbind(this.connection.query, this.connection, "SELECT catalogue.uid, category.name, catalogue.product_name from catalogue JOIN category on category.uid=catalogue.category LEFT OUTER JOIN catalogue_location ON catalogue_location.catalogue=catalogue.uid WHERE catalogue_location.location=? OR catalogue_location.location IS NULL");        
    },    
}

module.exports = {
    db : Object.create(db),  
};