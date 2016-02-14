var app = require('../main');

//setup a simple fake function for jsonp stuff, should do this with a completely replicated
//response object, meh, this will do for now

describe("Main.js confirmUser function checks", function() {
     it("Checks that the passed value is not null", function(done) {
         app.confirmUser.bind({
            res : {
                jsonp : function(response) {
                    //check our returned value 
                    expect(response).not.toBeNull();
                    expect(response).toBeDefined();
                    
                    if (response) {
                        expect(response.meta).toBeDefined();
                        
                        if (response.meta) {
                            expect(response.meta.code).toBe(500);
                            expect(response.meta.message).toBe("Database did not respond with an expected result");
                        }                                                
                    }
                    
                    done();
                },
            }  
         })(null);
     });
     
     it("Checks that the given data from the database is not null", function(done) {
         app.confirmUser.bind({
             res : {
                 jsonp : function(response) {
                     expect(response).not.toBeNull();
                     expect(response).toBeDefined();
                     
                     if (response) {
                         expect(response.meta).toBeDefined();
                         
                         if (response.meta) {
                             expect(response.meta.code).toBe(404);
                             expect(response.meta.message).toBe("No such user found");
                         }
                     }
                     
                     done();
                 }
             }
         })([null, null]);
     });
     
     it("Checks that an empty result is handled correctly", function(done) {
         app.confirmUser.bind({
             res : {
                 jsonp : function(response) {
                     expect(response).not.toBeNull();
                     expect(response).toBeDefined();
                     
                     if (response) {
                         expect(response.meta).toBeDefined();
                         
                         if (response.meta) {
                             expect(response.meta.code).toBe(404);
                             expect(response.meta.message).toBe("No such user found");
                         }
                     }
                     
                     done();
                 }
             }
         })([[], null]);
     });          
});