app.controller('categoryCtl',function($scope,$http,$route,$location,$routeParams,$window,$timeout,BASE){
   $scope.$route = $route;
  $scope.activePath = null;
  var baseUrl = window.location.origin+BASE+'/api';
  var currentUrl = $location.absUrl();
  // uplod Image
  $scope.getGallery = function(){
    $http.get(baseUrl+'/gallery').then(function(response){
      $scope.dataGallery = response.data;
    });
  };
      $scope.hasFile = null;
      $scope.uploadFile = function() {
        var uploadUrl = baseUrl+'/gallery';
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
              $scope.progress = false;
            }else {
              $scope.progress = true;
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
        $scope.lagreFile = false;
        $scope.progress = false;
        var remove = confirm('delete picture id '+id);
        var url =  baseUrl+'/gallery/'+id;

        if(remove){
          $http.delete(url).then(function(response){
            $scope.getGallery();
          });
        }
      };
      $scope.selectPic = function (img) {
        $scope.photo = img;
      };
      $scope.closeModule = function(){
        $scope.lagreFile = false;
        $scope.progress = false;
      }

    $scope.max = 100;
    $scope.counter = 0;
    $scope.status = '';

    $scope.onTimeOut = function(){
      if($scope.counter<$scope.max){
        $scope.counter++;
        $scope.status = $scope.counter+'%';
        mytimeout = $timeout($scope.onTimeOut,30);
      }else if ($scope.counter == 100) {
        $scope.status = 'completed!';
        $scope.getGallery();
      }
    };

      //get category data
      $scope.getCategory = function(){
        var url = baseUrl+'/category';
        $http.get(url).then(function(response){
          $scope.categoryList = response.data;
          $scope.bigTotalItems = $scope.categoryList.length;
          $scope.bigItemsPerPage = 5;
          $scope.maxSize = 6;
          $scope.bigCurrentPage = 1;
        });
      };
      //event Insert
      $scope.btnInsertCate = function(){
        $scope.activePath = $location.path('/admin/category/create');
      };
      $scope.insertCategory = function(){
        var url = baseUrl+'/category';
        $http.post(url,
          {
              'name':$scope.name,
              'description':$scope.description,
              'cover':$scope.photo,
              'other_info':$scope.other_info

          },{
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }

        }).then(function(response){
          alert('you have successed to insert new category!');
          $scope.getCategory();
          $scope.activePath = $location.path('/admin/category');
        },function (error) {
          alert('Insert is bad working');
        });
      };
      //event Edit

      $scope.btnEditCate = function(id){
        $scope.activePath = $location.path('/admin/category/update/'+id);
      };

      $scope.filterCategory = function(){
        var id = $routeParams.id;
        var url = baseUrl+'/category/'+id;
        $http.get(url).then(function(response){
          console.log(response.data.category_id);
          $scope.category_id = response.data.category_id;
          $scope.name = response.data.category_name;
          $scope.description = response.data.category_description;
          $scope.photo = response.data.category_cover;
          $scope.other_info = response.data.category_other_info;
        });
      };
      $scope.updateCategory = function(){
        var url = baseUrl+'/category';
        $http.put(url,{
            'category_id':$scope.category_id,
            'name':$scope.name,
            'description':$scope.description,
            'cover':$scope.photo,
            'other_info':$scope.other_info

        },{
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
        }).then(function(response){
          alert('update successed!');
          $scope.getCategory();
          $scope.activePath = $location.path('/admin/category');
        },function(error){
          alert('update is bad working!');
        });
      };
      //event Delete category
      $scope.deleteCategory = function(id){
        var deleteCate = confirm('Are you sure want to delete this category ID: '+id);
        if(deleteCate){
          var url = baseUrl+'/category/'+id;
          $http.delete(url).then(function(response){
            console.log(response);
            $scope.getCategory();
          },function(error){
            console.log(Error);
          });
        }

      };
      // -- schedule --
      $scope.getSchedule = function(){
        var url = baseUrl+'/schedule';
        $http.get(url).then(function(response){
          $scope.scheduleList = response.data;
          $scope.bigTotalItems = $scope.scheduleList.length;
          $scope.bigItemsPerPage = 5;
          $scope.maxSize = 6;
          $scope.bigCurrentPage = 1;
        });
      };
      // event btn Insert schedule
      $scope.btnInsertSche = function(){
        $scope.activePath = $location.path('/admin/schedule/create');
      } ;
      $scope.insertSchedule = function(){
        var url = baseUrl+'/schedule';
        $http.post(url,
          {
              'time':$scope.time,
              'description':$scope.description,
              'cover':$scope.photo,
              'start_date':$scope.start_date,
              'turn':$scope.turn,
              'other_info':$scope.other_info

          },{
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
          }).then(function(response){
            alert('create schedule is successed!');
            $scope.activePath = $location.path('/admin/schedule');
          },function(error){
            alert('bad working!');
          });
      };
      //event edit schedule
      $scope.btnEditSche = function(id){
        $scope.activePath = $location.path('/admin/schedule/update/'+id);
      };
      $scope.filterSchedule = function(){
        var id = $routeParams.id;
        var url = baseUrl+'/schedule/'+id;
        $http.get(url).then(function(response){
          $scope.schedule_id = response.data.schedule_id;
          $scope.time = response.data.schedule_time;
          $scope.description = response.data.schedule_description;
          $scope.photo = response.data.schedule_cover;
          $scope.start_date = response.data.schedule_start_date;
          $scope.turn = response.data.schedule_turn;
          $scope.other_info = response.data.schedule_other_info;
        });
      };
      $scope.updateSchedule = function(){
        var url = baseUrl+'/schedule';
        $http.put(url,{

            'schedule_id':$scope.schedule_id,
            'time':$scope.time,
            'description':$scope.description,
            'cover':$scope.photo,
            'start_date':$scope.start_date,
            'turn':$scope.turn,
            'other_info':$scope.other_info

        },{
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
        }).then(function(response){
          alert('update is successed!');
          $scope.activePath = $location.path('/admin/schedule');
        },function(error){
          alert('bad working!');
        });
      };
      $scope.deleteSche = function(id){
        var deleteSchedule  = confirm('Are you sure want to delete schedule ID: '+id);
        if(deleteSchedule){
          var url = baseUrl+'/schedule/'+id;
          $http.delete(url).then(function(response){
            $scope.getSchedule();
          });
        }
      };
      $scope.canCel = function(){
        $window.history.back();
      }

});
