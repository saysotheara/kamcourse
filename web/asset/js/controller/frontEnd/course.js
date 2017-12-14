app.controller("userCtrl",function($scope,$route,$http,$location,$routeParams,$timeout,BASE){
    $scope.$route = $route;
    $scope.activePath = null;
    var baseUrl = window.location.origin+BASE;
    var url = $location.absUrl();

    $scope.getListCourse = function(){
      var idCategory = $routeParams.categoryId;
      if(idCategory){
        $http.get(baseUrl+'/api/class/category/'+idCategory).then(function(response){
          $scope.listCourse = response.data;
          $scope.listCourse = response.data;
          $scope.bigTotalItems = $scope.listCourse.length;
          $scope.bigItemsPerPage = 4;
          $scope.maxSize = 6;
          $scope.bigCurrentPage = 1;
          $scope.topCourse($scope.listCourse);
        });
      }else {
        $http.get(baseUrl+'/api/class').then(function(response){
          $scope.listCourse = response.data;
          $scope.bigTotalItems = $scope.listCourse.length;
          $scope.bigItemsPerPage = 4;
          $scope.maxSize = 6;
          $scope.bigCurrentPage = 1;
          $scope.topCourse($scope.listCourse);

        });
      }
    };
    $scope.topCourse = function(dataCourse){
      $scope.lastCourse = [];
      var count = 0;
      angular.forEach(dataCourse,function (value,index) {
        count = count + 1;
        if( count <= 4){
          $scope.lastCourse.push(value);
          }
      });
    };
    $scope.detail = function(id){
      $scope.activePath = $location.path('/course/'+id);
    };
    $scope.showDetail = function(){
      var id = $routeParams.id;
      var url = baseUrl+'/api/class/user/'+id;
      $http.get(url).then(function(response){
        $scope.courseData = response.data;
      });
      $scope.totalMember();

    };
    $scope.getCategory = function(){
      $http.get(baseUrl+'/api/category').then(function(response){
        $scope.dataCategory = response.data;
      });
    };
    $scope.onByCategory = function($categoryId){
      $scope.activePath = $location.path('/class/category/'+$categoryId);
    };

    $scope.registerCourse = function(){
      var url = baseUrl+'/api/user';
      var classId = $routeParams.id;
      $http.post( url,
        {
            'name':$scope.name,
            'sex':$scope.sex,
            'email':$scope.email,
            'phone':$scope.phone,
            'studyTime': $scope.studyTime,
            'classId':classId
        },
        {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function(response){
            console.log(response);
            alert('you have registed!');
              $scope.totalMember();
        });
    };
    $scope.totalMember = function(){
      var id = $routeParams.id;
      $http.get(baseUrl+'/api/user/'+id).then(function(response){
        $scope.members = response.data;
        console.log(response);
      })
    }


});
