var app=angular.module('home', ['angular-loading-bar', 'ngAnimate','ngRoute']).
config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
	cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold =0;
}]);


app.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/login', {
            templateUrl : '/template/login.ejs',
            controller  : 'loginController'
        })
        
        .when('/register',{
        	 templateUrl : '/template/register.ejs',
             controller  : 'registerController'
        	
        })
        .otherwise({
       	 templateUrl : '/template/homeCarousel.ejs',
            controller  : 'carouselController'
       	
       }) 
});


app.controller('loginController', function($scope) {
    // create a message to display in our view
   // $scope.message = 'Login Page';
});

app.controller('registerController', function($scope) {
    // create a message to display in our view
    //$scope.message = 'Register Page';
});


app.controller('carouselController', function($scope) {
    // create a message to display in our view
  //  $scope.templateLocation = '/template/contact.ejs';
});



app.controller('displayCtrl',function($scope,$http){});
