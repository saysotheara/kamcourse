app.controller("loginCtrl",function($scope,$routeParams,$http,$location,$rootScope,$cookieStore,$route){
  $scope.hasLogIn = $cookieStore.get('loggedIn');
  $scope.loginAdmin = function(){
    if($scope.username == 'admin' && $scope.password == '1234'){

      $cookieStore.put('loggedIn',true);
      $location.path('/admin/course');

    }
  };
  $scope.logout = function(){
    
    $cookieStore.remove('loggedIn');
    $location.path('/admin');

  };



});
