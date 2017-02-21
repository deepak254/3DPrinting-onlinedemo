var app=angular.module('dashboard', ['angular-loading-bar', 'ngAnimate','ngRoute']).
config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
	cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold =0;
}]);


app.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/features', {
            templateUrl : '/template/features.ejs',
            controller  : 'featuresController'
        })
        .when('/services',{
       	 templateUrl : '/template/login.ejs',
            controller  : 'featuresController'
       	
       })
        .when('/browseProducts',{
       	 templateUrl : '/template/allProducts.ejs',
            controller  : 'productsController'
       	
       })
       
        .when('/uploadProduct',{
       	 templateUrl : '/template/imageUpload.ejs',
            controller  : 'uploadController'
       	
       })
       .when('/editUserDetails',{
       	 templateUrl : '/template/edit_userDetails.ejs',
         controller  : 'editUserController'
       	
       })
       .when('/editUserAddress',{
       	 templateUrl : '/template/editUserAddress.ejs',
         controller  : 'editUserAddressController'
       	
       })
       .when('/getOrderHistory',{
       	 templateUrl : '/template/orderHistory.ejs',
         controller  : 'orderHistoryController'
       	
       })
       
       .otherwise({
       	   templateUrl : '/template/dashboardHome.ejs',
            controller  : 'dashboardController'
       	
       })   
        
});

app.controller('featuresController', function($scope) {
    // create a message to display in our view
   // $scope.message = 'Login Page';
});

app.controller('productsController', function($scope) {
    // create a message to display in our view
   // $scope.message = 'Login Page';
});

app.controller('dashboardController', function($scope) {
    // create a message to display in our view
   // $scope.message = 'Login Page';
});

app.controller('uploadController', function($scope) {
	
	//alert($scope.currentUser.firstName);
  $scope.user=$scope.currentUser;
});


app.controller('orderHistoryController', function($scope,$http) {
	
	  $http({
	   method  :'GET',
	   url:'/getOrderHistory',
	   data: JSON.stringify($scope.currentUser),
	   headers: {'Content-Type': 'application/json'}
	  }).then(function successCallback(response) {
		  $scope.orderHistory=response.data;
		  }, function errorCallback(response) {
			  //something went wrong
	  });

	  
	});



app.controller('editUserAddressController', function($scope,$http) {
	
	$scope.changeAddress=function(){
		  $http({
		   method  :'POST',
		   url:'/editUserAddress',
		   data: JSON.stringify($scope.currentUser),
		   headers: {'Content-Type': 'application/json'}
		  }).then(function successCallback(response) {
			  $scope.editAddressMessage='Address Updated Successfully';
			  }, function errorCallback(response) {
				  $scope.editAddressMessage='something went wrong';
		  });
		  };

	
	
});


app.controller('editUserController', function($scope,$http) {

	//alert($scope.currentUser.email);
	$scope.processForm=function(){
	  $http({
	   method  :'POST',
	   url:'/editUser',
	   data: JSON.stringify($scope.currentUser),
	   headers: {'Content-Type': 'application/json'}
	  }).then(function successCallback(response) {
		 
		  $scope.message='Details Updated Successfully';
		  }, function errorCallback(response) {
		    
	  });
	  };
});



app.controller('mainController', function($scope) {
	
	
	  $scope.user=$scope.currentUser;
	});

