var app=angular.module('uploadRequirement', ['angular-loading-bar', 'ngAnimate','ngRoute']).
config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold =0;
}]);

app.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/uploadImage', {
            templateUrl : '/template/imageUpload.ejs',
            controller  : 'uploadController'
        })
        .otherwise({
        	templateUrl : '/template/register_guest.ejs',
            controller  : 'registerController'
        }); 
      
});

app.controller('uploadController', function($scope) {
//	$http({
//		  method: 'GET',
//		  url: '/testAjax'
//		}).then(function successCallback(response) {
//		    $scope.user=response.data;
//		  }, function errorCallback(response) {
//		    
//		  });
	
	
	
});

app.controller('registerController', function($scope) {
	
	

	
	
});


app.controller('demoController',function($log,$scope,$http){
	
	$scope.user={}; 
	$scope.guest=$scope.user; 
	$log.info('hello');
	$log.warn('warning');
	$log.error('I am error');
	$log.log($scope);
	$scope.name="deepak";	
	$log.log($http);
	$scope.email="dede@gmail.com";
	$scope.firstName="deepak";
	$log.log($scope.email);
	
});