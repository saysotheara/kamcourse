var app = angular.module("myApp",["ngRoute"]);
app.config(function($routeProvider){
  $routeProvider.when("/course",{
    templateUrl: "templates/courses/course.html",
    controller: "courseCtl"
  }).when('/create',{
    templateUrl: "templates/courses/create.html",
    controller: "courseCtl"

  }).when('/update/:id',{
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
  var dataId = null;
  this.myDate = new Date();

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
    $scope.btnUpdate = function (id) {

      $scope.activePath = $location.path('/update/'+id);
    };
    $scope.filterCourse = function(){
      var id = $routeParams.id;
      var url = baseUrl+'/api/course/'+id;
        $http.get(url).then(function(response){
          $scope.id = response.data.course_id;
          $scope.name = response.data.course_name;
          $scope.category = response.data.course_category;
          $scope.schedule = response.data.schedule;
          $scope.study_time = response.data.study_time;
          $scope.start_date = response.data.start_date;
          $scope.duration = response.data.course_duration;
          $scope.lecturer = response.data.lecturer;
          $scope.fee = response.data.course_fee;
          $scope.photo = response.data.course_media;
          $scope.video = response.data.course_video;
          $scope.description = response.data.description;
          $scope.outline = response.data.course_outline;
          console.log('Success');


        },function(response){
          console.log(ERROR);
        });
    };
  $scope.updateCourse = function(){
    var id = $scope.id;
    $http.put(baseUrl+'/api/course/'+id,{
      'id': id,
      'name':$scope.name,
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
        }).then(function (response) {
      console.log('Success');
      $scope.activePath = $location.path('/course');
    },function(response){
      console.log(ERROR);
    });
  }
});
