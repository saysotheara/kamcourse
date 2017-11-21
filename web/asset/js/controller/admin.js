app.controller("loginCtrl",function($scope,$routeParams,$http,$location,$rootScope,$cookieStore,$route){
  $scope.hasLogIn = $cookieStore.get('loggedIn');
  $scope.activePath = null;
  $scope.loginAdmin = function(){
    if($scope.username == 'admin' && $scope.password == '1234'){

      $cookieStore.put('loggedIn',true);
    
      $scope.activePath = $location.path('/admin/course');

    }
  };
  $scope.logout = function(){

    $cookieStore.remove('loggedIn');
    $scope.activePath = $location.path('/admin');

  };



});
