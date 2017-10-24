
app.controller("ClassController", function($scope, $http, $location, $routeParams, uploadFile){

    $scope.activePath = null;
    var baseUrl = window.location.origin;
    var url = $location.absUrl();

	$scope.onSaveNextClick = function() {
		alert('Save Next Clicked');
	}

	$scope.onSaveCloseClick = function() {
		alert('Save Close Clicked');
	}

	$scope.onNewClassClick = function() {
      $scope.activePath = url+$location.path('/admin/class/add');		
	}

});
