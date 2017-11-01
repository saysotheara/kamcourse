app.controller("loginCtrl",function($scope,$routeParams,$http,$location){

  $scope.loginAdmin = function(){
    var username = $scope.username;
    var pass = $scope.password;
    
    if($scope.username == 'admin' && $scope.password == '1234'){
      $location.path('/admin/course');
    }
  };

});
