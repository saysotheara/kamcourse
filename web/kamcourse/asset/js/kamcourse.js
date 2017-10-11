var app = angular.module("myApp",["ngRoute"]);
app.config(function($routeProvider){
  $routeProvider.when("/course",{
    templateUrl: "templates/courses/course.html",
    controller: "courseCtl"
  }).when('/create',{
    templateUrl: "templates/courses/create.html",
    controller: "courseCtl"

  }).when('/update',{
    templateUrl: "templates/courses/update.html",
    controller: "courseCtl"
  }).otherwise({
        redirectTo: '/course'
    });;
});
app.controller("courseCtl",function($scope,$http,$location,$routeParams){
  $scope.activePath = null;
  var baseUrl = window.location.origin;
  var url = $location.absUrl();
  $scope.getCourse = function(){
    $http.get(baseUrl+'/api/course').then(function(response){
      $scope.courseData = response.data;
    });
    },
    $scope.btnCreate = function(){

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


      },{
    headers: {
            'Content-Type': 'application/json; charset=utf-8'}
          }).then(function(response){
            console.log('Success!');
            $scope.activePath = $location.path('/');

          },function(response){
            console.log(ERROR);
          });

    };
    $scope.btnUpdate = function () {

    $scope.name ='Hello';

      $scope.activePath = url+$location.path('/update');
    }
});
