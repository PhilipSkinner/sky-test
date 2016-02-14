var request = require('request');
var base = 'http://localhost:8080/api/v1/customer/location';
var app = require('../main');

describe("API::V1 Customer Location endpoint test", function() {
    describe("GET /api/v1/customer/location", function() {
        it("returns 200", function(done) {
            request.get(base, function(error, response, body) {  
                expect(response).not.toBeNull(); 
                expect(response).toBeDefined();
                if (response) {
                    expect(response.statusCode).toBe(200);                    
                }                                                                                                                 
                done();
            });
        });
        
        it("checks for null customerID", function(done) {
            request.get(base, function(error, response, body) {
                expect(body).not.toBeNull();                
                expect(body).toBeDefined();
                                                
                if (body) {
                    body = JSON.parse(body);
                    expect(body.meta).toBeDefined();
                    
                    expect(body.meta.message).toBeDefined();
                    expect(body.meta.message).toBe("Missing customerID argument");
                    
                    expect(body.meta.code).toBeDefined();
                    expect(body.meta.code).toBe(500);
                }
                done();
            });
        });
        
        it("checks for invalid customerID", function(done) {
            request.get(base + '?customerID=sillyvalue', function(error, response, body) {                                
                expect(body).not.toBeNull();
                expect(body).toBeDefined();
                
                if (body) {
                    body = JSON.parse(body);
                    expect(body.meta).toBeDefined();
                    
                    expect(body.meta.message).toBeDefined();
                    expect(body.meta.message).toBe("No such user found");
                    
                    expect(body.meta.code).toBeDefined();
                    expect(body.meta.code).toBe(404);
                }
                
                done();
            });
        });
    });
    
    describe("POST /api/v1/customer/location", function() {
        it("returns 404", function(done) {
            request.post(base, function(error, response, body) {
                expect(response).not.toBeNull(); 
                expect(response).toBeDefined();                          
                if (response) {
                    expect(response.statusCode).toBe(404);                    
                }                               
                done();
            });
        });
    });
    
    describe("DELETE /api/v1/customer/location", function() {
        it("returns 404", function(done) {
            request.del(base, function(error, response, body) {
                expect(response).not.toBeNull(); 
                expect(response).toBeDefined();
                if (response) {
                    expect(response.statusCode).toBe(404);                    
                }                               
                done();
            });
        }); 
    });
    
    describe("PUT /api/v1/customer/location", function() {
         it("returns 404", function(done) {
             request.put(base, function(error, response, body) {
                expect(response).not.toBeNull(); 
                expect(response).toBeDefined();
                if (response) {
                    expect(response.statusCode).toBe(404);                    
                }                               
                done();
            });
         });
    });     
});