app.controller("loginCtrl",function($scope,$routeParams,$http,$location,$rootScope,$cookieStore){

  $scope.loginAdmin = function(){
    if($scope.username == 'admin' && $scope.password == '1234'){
      $cookieStore.put('loggedIn',true);
      $location.path('/admin/course');

    }
  };

});
