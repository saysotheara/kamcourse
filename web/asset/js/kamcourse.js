
var app = angular.module("KamcourseApp", ["ngRoute", "angular-thumbnails"]);

app.config(function($routeProvider){
    $routeProvider.when("/admin/course",{
        templateUrl: "template/course/course.html",
        controller: "courseCtl"
    }).when('/admin/create',{
        templateUrl: "template/course/create.html",
        controller: "courseCtl"

    }).when('/admin/update/:id',{
        templateUrl: "template/course/update.html",
        controller: "courseCtl"
    }).when('/course',{
        templateUrl: "template/course/frontEnd/course1.html",
        controller: "userCtrl"
    }).when('/course/:id',{
        templateUrl: "template/course/frontEnd/detail.html",
        controller: "userCtrl"


    // Class Management
    }).when('/admin/class',{
        templateUrl: "template/class/class-list.html",
        controller: "ClassController"
    }).when('/admin/class/add',{
        templateUrl: "template/class/class-add.html",
        controller: "ClassController"
    }).when('/admin/class/update',{
        templateUrl: "template/class/class-update.html",
        controller: "ClassController"

    // URL Path Not Found        
    }).otherwise({
        redirectTo: '/course'
    });
});


app.service('uploadFile',function($http){
  this.uploadtoServer = function(file,url){
    var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined,'Process-Data': false}
        }).then(function(data){
          alert(data);
        },function(data){
          alert("Error");
        });
  }
});

app.controller("courseCtl",function($scope,$http,$location,$routeParams,uploadFile){
    $scope.activePath = null;
    var baseUrl = window.location.origin;
    var url = $location.absUrl();
    var dataId = null;


    $scope.getCourse = function(){
        $http.get(baseUrl+'/api/course').then(function(response){
            $scope.courseData = response.data;
        });
    };

    $scope.btnCreate = function(){
      $scope.activePath = url+$location.path('/admin/create');
    };

    $scope.btnSaveNext = function(){
        var url = baseUrl+'/api/course';
        var youtube = $scope.video;
         
        $http.post(
            url,
            {
                'name':$scope.title,
                'description':$scope.description,
                'category':$scope.category,
                'outline':$scope.outline,
                'duration':$scope.duration,
                'fee':$scope.fee,
                'photo_url':$scope.photo,
                'video_url':youtube.split('https://www.youtube.com/watch?v=')[1]
            },
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then( function(response){
                console.log('Success!');
                $scope.activePath = $location.path('/');
                alert("Successfully created a new course");
            },function(response){
                console.log(ERROR);
                alert("Failed to create a new course");
            }
        );
    };

    $scope.btnUpdate = function (id) {

      $scope.activePath = $location.path('/admin/update/'+id);
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
          $scope.video = 'https://www.youtube.com/watch?v='+response.data.course_video;
          $scope.description = response.data.description;
          $scope.outline = response.data.course_outline;
          console.log('Success');


        },function(response){
          console.log(ERROR);
        });
    };

  $scope.updateCourse = function(){
    var id = $scope.id;
    var youtube = $scope.video;
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
      'video_url':youtube.split('https://www.youtube.com/watch?v=')[1],
    },{
  headers: {
          'Content-Type': 'application/json; charset=utf-8'}
        }).then(function (response) {
      console.log('Success');
      $scope.activePath = $location.path('/admin/course');
    },function(response){
      console.log(ERROR);
    });
  };
  $scope.deleteCourse = function(id){
    var deleteData = confirm('Are you sure want to delete ID '+id+' ?');
    var url = baseUrl+'/api/course/'+id;
    if(deleteData){
      $http.delete(url).then(function(response){
        $scope.getCourse();
      });
    }
  };
  $scope.getGallery = function(){
    $http.get(baseUrl+'/api/gallery').then(function(response){
      $scope.dataGallery = response.data;
    });
  };
  $scope.hasFile = null;
  $scope.uploadFile = function() {

             var uploadUrl = baseUrl+'/api/gallery';

             if($scope.hasFile){
               $scope.image = $scope.files[0];
                var file = $scope.image;
               var fd = new FormData();
               fd.append('file', file);
               var con = {
                 transformRequest: angular.identity,
                 headers: {'Content-Type': undefined,'Process-Data': false}
               };
               $scope.postGallery(uploadUrl,fd,con);
               }else if($scope.urlPic){
              var data = {'image': $scope.urlPic};
              var con = {
                    headers: {'Content-Type': 'application/json; charset=utf-8'}
                  };
                $scope.postGallery(uploadUrl,data,con);
              }
            };
    $scope.postGallery = function(url,data,con){
      $http.post(url,data,con).then(function(response){
        $scope.getGallery();
        $scope.src = null;
        console.log(response.data);
      },function(data){
        alert("Error");
      });
    };
     $scope.uploadedFile = function(element) {
            var reader = new FileReader();
            reader.onload = function(event) {
             $scope.$apply(function($scope) {
                $scope.files = element.files;
                 $scope.src = event.target.result;
                 $scope.hasFile = 'file';
             });
            }
            reader.readAsDataURL(element.files[0]);
          };
    $scope.changePic = function(){
      $scope.src = $scope.urlPic;
      $scope.files = null;

    };
    $scope.deletePic = function(id){
      var remove = confirm('delete picture id '+id);
      var url =  baseUrl+'/api/gallery/'+id;
      if(remove){
        $http.delete(url).then(function(response){
          $scope.getGallery();
        });
      }
    };
    $scope.selectPic = function (img) {
      $scope.photo = img;

    };


});


app.controller("userCtrl",function($http,$scope,$location,$routeParams){
  $scope.activePath = null;
  var baseUrl = window.location.origin;
  var url = $location.absUrl();
  $scope.getListCourse = function(){
    $http.get(baseUrl+'/api/course').then(function(response){
      $scope.listCourse = response.data;
    });
  };
  $scope.detail = function(id){
    $scope.activePath = $location.path('/course/'+id);
  };
  $scope.showDetail = function(){
    var id = $routeParams.id;
    var url = baseUrl+'/api/course/'+id;
    $http.get(url).then(function(response){
      $scope.courseData = response.data;
    });
  };


});
