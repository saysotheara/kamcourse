var app = angular.module("myApp",["ngRoute"]);
app.config(function($routeProvider){
  $routeProvider.when("/course",{
    templateUrl: "templates/courses/course.html",
    controller: "courseCtl"
  }).when('/create',{
    templateUrl: "templates/courses/create.html",
    controller: "courseCtl"

  }).otherwise({
        redirectTo: '/course'
    });;
});
app.controller("courseCtl",function($scope,$http,$location,$routeParams){
  $scope.activePath = null;
  var baseUrl = window.location.origin;
    $scope.btnCreate = function(){
      var url = $location.absUrl();
      $scope.activePath = url+$location.path('/create');
    },
    $scope.btnSaveNext = function(){
      var url = baseUrl+'/api/course';
       $http.post(url,{
        'name':$scope.title,
        'description':$scope.description,
        'category':$scope.category,
        'outline':$scope.outline,
        'study_time':$scope.study_time,
        'start_date':$scope.start_date,
        'lecturer':$scope.lecturer,
        'schedule':$scope.schedule,
        'duration':$scope.duration,
        'fee':$scope.fee,
        'photo_url':$scope.photo,
        'video_url':$scope.video,
        'other_info':$scope.other_info

      },
      {
    headers: {
            'Content-Type': 'application/json; charset=utf-8'}
          }).then(function(response){
            console.log('Success!');
            $scope.activePath = $location.path('/');

          },function(response){
            console.log(ERROR);
          });

    };
});
