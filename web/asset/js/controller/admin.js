app.controller("loginCtrl",function($scope,$routeParams,$http,$location,$rootScope){

  $scope.loginAdmin = function(){
    if($scope.username == 'admin' && $scope.password == '1234'){
      $rootScope.loggedIn = true;
      $location.path('/admin/course');

    }
  };

});
