catalogueAppControllers.controller('indexController', ['$scope', '$http', '$cookies',
    function ($scope, $http, $cookies) {
        $scope.customerID = $cookies.get('customerID') || 1; //for testing
        $scope.location = {
            name    : 'loading...',  
        };
        $scope.status = {
            news_status     : 'loading',
            sports_status   : 'loading',  
        };               
        $scope.news = [];
        $scope.sports = [];                
                
        //get the data from the API
        $http.get('/api/v1/customer/location?customerID=' + $scope.customerID)
        .then(function(response) {
            if (response && response.data) {                
                if (response.data.data) {
                    $scope.location = response.data.data;    
                }                
            }
            
            if ($scope.location && $scope.location.location_id) {
                $http.get('/api/v1/catalogue?locationID=' + $scope.location.location_id)
                .then(function(response) {                    
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
                                    console.log("it changed"); 
                                });                                
                            }
                            
                            for (var i = 0; i < $scope.sports.length; i++) {
                                $scope.$watch(function(scope) {
                                    return scope.sports[this].is_selected;    
                                }.bind(i), function() {
                                    console.log("it changed here too");
                                });
                            }                                                                  
                        }
                    }
                });              
            } else {
                //show an error to the user here
                alert("there was an error fetching your location data");
            }
        });
    }
]);