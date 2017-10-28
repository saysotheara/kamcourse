
app.controller("CourseController", function($scope,$http,$location,$routeParams){
  $scope.activePath = null;
  var baseUrl = window.location.origin;
  var currentUrl = $location.absUrl();
  $scope.getCourse = function(){
      $http.get(baseUrl+'/api/course').then(function(response){
          $scope.courseData = response.data;
      });
  };

  $scope.btnCreate = function(){
    $scope.activePath = currentUrl+$location.path('/admin/create');
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

  $scope.btnUpdate = function (id) {

    $scope.activePath = $location.path('kamcourse/admin/update/'+id);
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
    'duration':$scope.duration,
    'fee':$scope.fee,
    'photo_url':$scope.photo,
    'video_url':youtube
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
          var fromData = new FormData();
              fromData.append('file', file);
          var config = {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined,'Process-Data': false}
              };
          $scope.postGallery(uploadUrl,fromData,config);
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

        $scope.lastCourse = [];
        var count = 0;

        angular.forEach($scope.listCourse,function (value,index) {
          count = count + 1;
          if( count <= 4){
            $scope.lastCourse.push(value);


          }
        });

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
    var category = [{name:'Mechanical Engineering',color:'/web/asset/img/web1.png'},{name:'Civil Engineering',color:'/web/asset/img/web.png'},{name:'Architechture',color:'/web/asset/img/web3.png'},{name:'IT Engineering',color:'/web/asset/img/web1.png'},{name:'Electrical Engineering',color:'/web/asset/img/web3.png'}
                    ,{name:'Japanes Languages',color:'/web/asset/img/web.png'}];
    var row = '';
    angular.forEach(category,function(value,index){
        if( index < 2){
          row +=  '<div class="col-sm-6 category "><figure class="figure-6">'+
                  '<img src="'+value.color+'" alt="Thumb" width="100%" height="130" />'+
                  '<figcaption><div>'+value.name+'</div></figcation>'+
                  '</figure></div>';
        }else if(index < 5){
          row +=  '<div class="col-sm-4 category " ><figure class="figure-4">'+
                  '<img src="'+value.color+'" alt="Thumb" width="100%" height="130" />'+
                  '<figcaption><div>'+value.name+'</div></figcation>'+
                  '</figure></div>';
        }else if(index >= 5){
          row +=  '<div class="col-sm-6  category  " ><figure class="figure-6 ">'+
                  '<img src="'+value.color+'" alt="Thumb" width="100%" height="130" />'+
                  '<figcaption><div>'+value.name+'</div></figcation>'+
                  '</figure></div>';
        }
    });
    $scope.myHtml = row;






});
