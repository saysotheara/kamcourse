
app.controller("CourseController", function($scope,$route,$http,$location,$routeParams,$timeout,BASE){
  $scope.$route = $route;
  $scope.activePath = null;
  var baseUrl = window.location.origin+BASE;
  var currentUrl = $location.absUrl();
  $scope.getCourse = function(){
      $http.get(baseUrl+'/api/course').then(function(response){
        $scope.courseData = response.data;
        $scope.bigTotalItems = $scope.courseData.length;
        $scope.bigItemsPerPage = 4;
        $scope.maxSize = 6;
        $scope.bigCurrentPage = 1;
      });
  };
  $scope.getCategory = function(){
    $http.get(baseUrl+'/api/category').then(function(response){
      $scope.categoryData = response.data;
    });
  };

  $scope.btnCreate = function(){

    $scope.activePath = currentUrl+$location.path('/admin/create');
  };

  $scope.btnSaveClose = function(){

      var url = baseUrl+'/api/course';
      var youtube = 'N/A';
      if($scope.video != null){
        youtube = $scope.video;
      }

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
              'video_url':youtube
          },
          {
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
              }
          }).then( function(response){
              console.log('Success!');
              $scope.activePath = $location.path('/admin/course');
              alert("Successfully created a new course");
          },function(response){
              console.log(ERROR);
              alert("Failed to create a new course");
          }
      );
  };
  $scope.btnSaveNext = function(){
      var url = baseUrl+'/api/course';
      var youtube = 'N/A';
      if($scope.video != null){
        youtube = $scope.video;
      }

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
              'video_url':youtube
          },
          {
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
              }
          }).then( function(response){
              console.log('Success!');
              alert("Successfully created a new course");
              $scope.title = '';
              $scope.description = '';
              $scope.category = '';
              $scope.outline = '';
              $scope.duration = '';
              $scope.fee = '';
              $scope.photo = '';
              $scope.video = '';
          },function(response){
              console.log(ERROR);
              alert("Failed to create a new course");
          }
      );
  };
  $scope.btnCancel = function(){
    $scope.activePath = $location.path('/admin/course');
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
        $scope.duration = response.data.course_duration;
        $scope.fee = response.data.course_fee;
        $scope.photo = response.data.course_cover;
        $scope.video = response.data.course_video;
        $scope.description = response.data.course_description;
        $scope.outline = response.data.course_outline;
      },function(response){
        console.log(ERROR);
      });
  };

$scope.updateCourse = function(){
  var id = $scope.id;
  var youtube = 'N/A';
  if($scope.video != ''){
    youtube = $scope.video;
  }
  $http.put(baseUrl+'/api/course/'+id,{
    'id': id,
    'name':$scope.name,
    'description':$scope.description,
    'category':$scope.category,
    'outline':$scope.outline,
    'duration':$scope.duration,
    'fee':$scope.fee,
    'photo_url':$scope.photo,
    'video_url':youtube
  },{
headers: {
        'Content-Type': 'application/json; charset=utf-8'}
      }).then(function (response) {
    alert('Update Successed!');
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
          var size = $scope.files[0].size;
          var file = $scope.image;
          var fromData = new FormData();
              fromData.append('file', file);
          var config = {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined,'Process-Data': false}
              };
          if(size >= 2097152 ){
            $scope.lagreFile = true;
          }else {
            $scope.postGallery(uploadUrl,fromData,config);

          }
      }else if($scope.urlPic){
          var data = {'image': $scope.urlPic};
          var config = {
              headers: {'Content-Type': 'application/json; charset=utf-8'}
                    };
              $scope.postGallery(uploadUrl,data,config);
                }
    };
    $scope.postGallery = function(url,data,con){
      $http.post(url,data,con).then(function(response){

        $scope.onTimeOut();
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
                $scope.counter = 0;
                $scope.status = '';
                $scope.lagreFile = false;
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

  $scope.max = 100;
  $scope.counter = 0;
  $scope.status = '';
  $scope.tabUpload = 'none';
  $scope.onTimeOut = function(){
    if($scope.counter<$scope.max){
      $scope.counter++;
      $scope.status = $scope.counter+'%';
      mytimeout = $timeout($scope.onTimeOut,30);
    }else if ($scope.counter == 100) {
      $scope.tabUpload = 'none';
      $scope.status = 'completed!';
      $scope.getGallery();
    }
  };



});
