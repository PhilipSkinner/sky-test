var catalogueApp = angular.module('catalogueApp', [
    'ngRoute',
    'ngCookies',
    'catalogueAppControllers',    
]);

catalogueApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl : '/static/templates/index.html',
            controller  : 'indexController',        
        }).otherwise({
           redirectTo   : '/', 
        });
    }
]);

var catalogueAppControllers = angular.module('catalogueAppControllers', []);