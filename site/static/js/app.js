var catalogueApp = angular.module('catalogueApp', [
    'ngRoute',
    'catalogueAppControllers',    
]);

catalogueApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl : '/static/templates/index.html',
            controller  : 'indexController',
        }).when('/confirm', {
            templateUrl : '/static/templates/confirm.html',
            controller  : 'confirmController',
        }).otherwise({
           redirectTo   : '/', 
        });
    }
]);

var catalogueAppControllers = angular.module('catalogueAppControllers', []);