app.controller("loginCtrl",function($scope,$routeParams,$http,$location,$rootScope,$cookieStore,$route,BASE){
  $scope.hasLogIn = $cookieStore.get('loggedIn');
  $scope.userLog = $cookieStore.get('userLog');

  $scope.activePath = null;
  $scope.loginAdmin = function(){
    if($scope.username == 'admin' && $scope.password == '1234'){
      $cookieStore.put('loggedIn',true);
      $cookieStore.put('userLog',false);

      $scope.activePath = $location.path('/admin/course');
    }else{
        var baseUrl = window.location.origin+BASE;
        var url = baseUrl+'/api/auth/student';
      $http.post(url,  {
            'username':$scope.username,
            'password':$scope.password
            },
        {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function(response){
          console.log(response.data);
          $cookieStore.put('userId',response.data.student_id);
          $cookieStore.put('userLog',true);
          $cookieStore.put('loggedIn',false);

          $scope.activePath = $location.path('/course');
        });
    }
  };
  $scope.logout = function(){
      $cookieStore.remove('loggedIn');
      $cookieStore.remove('userLog');
      $cookieStore.remove('userId');

      // $scope.activePath = $location.path('/admin');

  };



});
