catalogueAppControllers.controller('indexController', ['$scope', '$http', '$cookies',
    function ($scope, $http, $cookies) {
        $scope.customerID = $cookies.get('customerID') || 1; //for testing
        $scope.location = {
            name    : 'loading...',  
        };
        $scope.status = {
            news_status     : 'loading',
            sports_status   : 'loading',  
            basket_status   : 'empty',
        };               
        $scope.news = [];
        $scope.sports = [];          
        $scope.selected = [];      
        $scope.submitted = false;
                
        //get the data from the API
        $http.get('/api/v1/customer/location?customerID=' + $scope.customerID).then(locationFetched);
        
        function locationFetched(response) {      
            if (response && response.data) {                
                if (response.data.data) {
                    $scope.location = response.data.data;    
                }                
            }
            
            if ($scope.location && $scope.location.location_id) {
                $http.get('/api/v1/catalogue?locationID=' + $scope.location.location_id).then(catalogueFetched);              
            } else {
                //show an error to the user here
                alert("there was an error fetching your location data");
            }
        }
        
        function catalogueFetched(response) {                                
            if (response && response.data) {
                if (response.data.data) {                            
                    if (response.data.data.News) {
                        for (var i = 0; i < response.data.data.News.length; i++) {
                            response.data.data.News[i].is_selected = false;                                    
                        }
                        
                        $scope.news = response.data.data.News;  
                        $scope.status.news_status = 'completed';  
                    } else {
                        $scope.news = [];
                        $scope.status.news_status = 'empty';
                    }                            
                        
                    if (response.data.data.Sports) {
                        for (var i = 0; i < response.data.data.Sports.length; i++) {
                            response.data.data.Sports[i].is_selected = false;
                        }
                        
                        $scope.sports = response.data.data.Sports;
                        $scope.status.sports_status = 'completed';
                    } else {
                        $scope.sports = [];
                        $scope.status.sports_status = 'empty';
                    }   
                                                
                    //hook in events for detecting selection/deselection changes
                    for (var i = 0; i < $scope.news.length; i++) {
                        $scope.$watch(function(scope) {                                    
                            return scope.news[this].is_selected;
                        }.bind(i), function() { //I perfer bind to closure, its more readable I find
                            $scope.constructSelected(); 
                        });                                
                    }
                    
                    for (var i = 0; i < $scope.sports.length; i++) {
                        $scope.$watch(function(scope) {
                            return scope.sports[this].is_selected;    
                        }.bind(i), function() {
                            $scope.constructSelected();
                        });
                    }                                                                  
                }
            }        
        }
        
        //submit handler
        $scope.submit = function() {            
            if ($scope.selected.length == 0) {
                alert("You must select something before you can checkout");
                return false;
            }            
            return true;  
        };
        
        //lets make something to construct our selected items array
        $scope.constructSelected = function() {
            this.selected = [];
            
            for (var i = 0; i < this.news.length; i++) {
                if (this.news[i].is_selected) {
                    this.selected.push(this.news[i]);
                }
            }
            
            for (var i = 0; i < this.sports.length; i++) {
                if (this.sports[i].is_selected) {
                    this.selected.push(this.sports[i]);
                }
            }
            
            if (this.selected.length > 0) {
                this.status.basket_status = 'canCheckout';
            } else {
                this.status.basket_status = 'empty';
            }
        }.bind($scope);
    }
]);