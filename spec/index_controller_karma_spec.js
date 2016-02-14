describe("location fetch", function() {
    beforeEach(module('catalogueApp'));

    var $controller;
    var $scope;

    beforeEach(inject(function(_$controller_, _$rootScope_){        
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));
  
    beforeEach(function() {
        spyOn(window, 'alert');
    });
    
    it("should create an alert", function() {        
        var controller = $controller('indexController', { $scope: $scope });
        
        $scope.locationFetched(null);
        
        expect(window.alert).toHaveBeenCalledWith('there was an error fetching your location data');
    });
    
    it("should copy the data into $scope.location", function() {        
        var controller = $controller('indexController', { $scope: $scope });
        
        var response = {
            data : {
                data : {
                    uid         : 1,
                    name        : 'Leeds',
                    location_id : 'LEEDS',
                }
            }
        };
        
        $scope.locationFetched(response);
        
        expect($scope.location).toBe(response.data.data);
    });
    
    it("should setup the catalogue correctly", function() {
        var controller = $controller('indexController', { $scope: $scope });
        
        var response = {
            data : {
                data : {
                    News : [
                      {
                          id            : 1,
                          name          : 'News',
                          product_name  : 'Sky news',
                      }  
                    ],
                    Sports : [
                      {
                          id            : 2,
                          name          : 'Sports',
                          product_name  : 'Arsenal TV', 
                      }
                    ],
                }
            }
        };
        
        $scope.catalogueFetched(response);
        
        expect($scope.sports).toBe(response.data.data.Sports);
        expect($scope.news).toBe(response.data.data.News);        
    });
    
    /*etc etc, tests should include:
        1. The fact that when the is_selected flag is changed, the correct function is called
        2. When a selection status is changed, that the selected array reflects this
        3. That our UI status flags marry up with the current status of the data
        4. That submission of the form works as it should
    */
       
});